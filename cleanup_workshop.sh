#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC}  $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

print_progress() {
    echo -e "${CYAN}🔧${NC} $1"
}

# Function to confirm destructive operations
confirm_action() {
    local action="$1"
    echo -e "${YELLOW}⚠️  This will $action${NC}"
    read -p "$(echo -e "${RED}❓${NC} Are you sure? Type 'yes' to continue: ")" confirm
    if [ "$confirm" != "yes" ]; then
        echo "Operation cancelled."
        return 1
    fi
    return 0
}

# Function to cleanup individual participant resources
cleanup_participant() {
    local prefix="$1"
    local catalog="mcp_workshop_${prefix}"
    local app_name="mcp-workshop-app-${prefix}"

    print_progress "Cleaning up resources for participant: ${prefix}"

    # Check if participant config exists
    local config_file="databricks.${prefix}.yml"
    if [ ! -f "$config_file" ]; then
        print_warning "No config found for participant: ${prefix}"
        return 0
    fi

    # Run cleanup job if it exists
    print_progress "Running cleanup job for ${prefix}..."
    if databricks bundle run cleanup_resources -t dev --var-file "$config_file" 2>/dev/null; then
        print_status "Cleanup job completed for ${prefix}"
    else
        print_warning "Cleanup job failed or doesn't exist for ${prefix}"
    fi

    # Try to delete the app
    print_progress "Removing Databricks App: ${app_name}..."
    if databricks apps delete "$app_name" --yes 2>/dev/null; then
        print_status "Removed app: ${app_name}"
    else
        print_warning "App not found or already deleted: ${app_name}"
    fi

    # Try to drop the catalog (requires elevated permissions)
    print_progress "Attempting to drop catalog: ${catalog}..."
    if databricks sql query "DROP CATALOG IF EXISTS ${catalog} CASCADE" 2>/dev/null; then
        print_status "Dropped catalog: ${catalog}"
    else
        print_warning "Could not drop catalog (may require admin permissions): ${catalog}"
        print_info "You can manually drop it from the Databricks UI or with admin credentials"
    fi

    # Remove local config files
    if [ -f "$config_file" ]; then
        rm "$config_file"
        print_status "Removed config file: ${config_file}"
    fi
}

# Function to list all workshop participants
list_participants() {
    print_header "📋 Workshop Participants Found:"
    echo ""

    local count=0
    for config_file in databricks.*.yml; do
        if [ -f "$config_file" ] && [[ "$config_file" != "databricks.yml" ]]; then
            # Extract prefix from filename
            prefix=$(echo "$config_file" | sed 's/databricks\.//' | sed 's/\.yml//')

            # Try to extract participant name from the config
            participant_name=$(grep "# Databricks Asset Bundle Configuration for " "$config_file" | sed 's/# Databricks Asset Bundle Configuration for //' || echo "Unknown")

            echo -e "${CYAN}  ${count}. ${NC}Prefix: ${prefix} | Name: ${participant_name}"
            echo -e "     Catalog: mcp_workshop_${prefix}"
            echo -e "     App: mcp-workshop-app-${prefix}"
            echo ""

            ((count++))
        fi
    done

    if [ $count -eq 0 ]; then
        print_info "No workshop participant configurations found."
        print_info "Participants are identified by 'databricks.<prefix>.yml' files."
    else
        print_info "Found ${count} participant configuration(s)."
    fi

    return $count
}

# Function to cleanup all workshop resources
cleanup_all() {
    print_header "🧹 Cleaning Up All Workshop Resources"
    echo ""

    if ! confirm_action "delete ALL workshop resources for ALL participants"; then
        exit 0
    fi

    local cleaned_count=0
    for config_file in databricks.*.yml; do
        if [ -f "$config_file" ] && [[ "$config_file" != "databricks.yml" ]]; then
            prefix=$(echo "$config_file" | sed 's/databricks\.//' | sed 's/\.yml//')
            cleanup_participant "$prefix"
            ((cleaned_count++))
        fi
    done

    # Clean up any remaining workshop catalogs that might not have configs
    print_progress "Checking for orphaned workshop catalogs..."
    if command -v databricks &> /dev/null; then
        # List all catalogs and filter for workshop ones
        databricks sql query "SHOW CATALOGS" --output json 2>/dev/null | jq -r '.[].catalog_name' 2>/dev/null | grep "^mcp_workshop_" | while read catalog; do
            print_warning "Found orphaned catalog: ${catalog}"
            if databricks sql query "DROP CATALOG IF EXISTS ${catalog} CASCADE" 2>/dev/null; then
                print_status "Dropped orphaned catalog: ${catalog}"
            else
                print_warning "Could not drop catalog: ${catalog}"
            fi
        done || print_info "No orphaned catalogs found or jq not available"
    fi

    # Clean up any remaining workshop apps
    print_progress "Checking for orphaned workshop apps..."
    if command -v databricks &> /dev/null; then
        databricks apps list --output json 2>/dev/null | jq -r '.[].name' 2>/dev/null | grep "^mcp-workshop-app-" | while read app; do
            print_warning "Found orphaned app: ${app}"
            if databricks apps delete "$app" --yes 2>/dev/null; then
                print_status "Removed orphaned app: ${app}"
            else
                print_warning "Could not remove app: ${app}"
            fi
        done || print_info "No orphaned apps found or jq not available"
    fi

    print_status "Cleanup completed! Processed ${cleaned_count} participant configuration(s)."
}

# Function to cleanup specific participant
cleanup_specific() {
    local target_prefix="$1"

    if [ -z "$target_prefix" ]; then
        print_error "Please specify a participant prefix to cleanup."
        echo "Usage: $0 --participant <prefix>"
        exit 1
    fi

    print_header "🧹 Cleaning Up Resources for Participant: ${target_prefix}"
    echo ""

    if ! confirm_action "delete ALL resources for participant: ${target_prefix}"; then
        exit 0
    fi

    cleanup_participant "$target_prefix"
    print_status "Cleanup completed for participant: ${target_prefix}"
}

# Main function
main() {
    clear
    echo -e "${PURPLE}🧹 Databricks MCP Workshop Cleanup${NC}"
    echo -e "${PURPLE}===================================${NC}"
    echo ""

    case "${1:-}" in
        "--list" | "-l")
            list_participants
            ;;
        "--all" | "-a")
            cleanup_all
            ;;
        "--participant" | "-p")
            cleanup_specific "$2"
            ;;
        "--help" | "-h")
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --list, -l              List all workshop participants and their resources"
            echo "  --all, -a               Clean up ALL workshop resources (DESTRUCTIVE)"
            echo "  --participant, -p <id>  Clean up resources for specific participant"
            echo "  --help, -h              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --list                    # List all participants"
            echo "  $0 --participant john_doe    # Clean up resources for john_doe"
            echo "  $0 --all                     # Clean up everything (use with caution!)"
            ;;
        "")
            # Interactive mode
            echo "What would you like to do?"
            echo ""
            echo "1. List all workshop participants and resources"
            echo "2. Clean up resources for a specific participant"
            echo "3. Clean up ALL workshop resources (DESTRUCTIVE)"
            echo "4. Exit"
            echo ""

            read -p "$(echo -e "${BLUE}❓${NC} Select an option (1-4): ")" choice

            case $choice in
                1)
                    list_participants
                    ;;
                2)
                    echo ""
                    read -p "$(echo -e "${BLUE}❓${NC} Enter participant prefix to cleanup: ")" prefix
                    cleanup_specific "$prefix"
                    ;;
                3)
                    cleanup_all
                    ;;
                4)
                    echo "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option. Please run with --help for usage information."
                    exit 1
                    ;;
            esac
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Run '$0 --help' for usage information."
            exit 1
            ;;
    esac
}

# Check if databricks CLI is available
if ! command -v databricks &> /dev/null; then
    print_error "Databricks CLI not found. Please install it first:"
    print_info "pip install databricks-cli"
    exit 1
fi

# Run main function
main "$@"