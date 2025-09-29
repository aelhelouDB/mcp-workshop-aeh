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

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"

    read -p "$(echo -e "${BLUE}❓${NC} $prompt [$default]: ")" input
    if [ -z "$input" ]; then
        input="$default"
    fi

    # Set the variable dynamically
    eval "$var_name='$input'"
}

# Function to clean username for resource naming
clean_username() {
    local username="$1"
    # Take first part before @ or . and clean it
    local first_part=$(echo "$username" | cut -d'@' -f1 | cut -d'.' -f1)
    # Convert to lowercase, replace spaces and hyphens with underscores, remove special chars
    echo "$first_part" | tr '[:upper:]' '[:lower:]' | tr ' -' '__' | sed 's/[^a-z0-9_]//g' | sed 's/__*/_/g' | sed 's/^_//' | sed 's/_$//'
}

# Function to update or add a value in .env.local
update_env_value() {
    local key="$1"
    local value="$2"
    local comment="$3"

    if grep -q "^${key}=" .env.local 2>/dev/null; then
        # Update existing value
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS sed
            sed -i '' "s|^${key}=.*|${key}=${value}|" .env.local
        else
            # Linux sed
            sed -i "s|^${key}=.*|${key}=${value}|" .env.local
        fi
    else
        # Add new value with comment if provided
        if [ -n "$comment" ]; then
            echo "" >> .env.local
            echo "# $comment" >> .env.local
        fi
        echo "${key}=${value}" >> .env.local
    fi
}

# Function to test databricks connection
test_databricks_connection() {
    local profile="$1"
    print_progress "Testing Databricks connection..."

    if [ -n "$profile" ]; then
        if databricks current-user me --profile "$profile" >/dev/null 2>&1; then
            print_status "Successfully connected to Databricks with profile '$profile'"
            return 0
        else
            print_error "Failed to connect to Databricks with profile '$profile'"
            return 1
        fi
    else
        if databricks current-user me >/dev/null 2>&1; then
            print_status "Successfully connected to Databricks"
            return 0
        else
            print_error "Failed to connect to Databricks"
            return 1
        fi
    fi
}

# Function to install missing dependencies
install_dependencies() {
    print_header "🔧 Checking and installing dependencies..."

    # Check for databricks CLI
    if ! command -v databricks &> /dev/null; then
        print_progress "Installing Databricks CLI..."
        if command -v pip &> /dev/null; then
            pip install databricks-cli
        elif command -v pip3 &> /dev/null; then
            pip3 install databricks-cli
        else
            print_error "pip not found. Please install Python and pip first."
            exit 1
        fi
        print_status "Databricks CLI installed"
    else
        print_status "Databricks CLI found"
    fi

    # Check for Node.js/npm for frontend
    if ! command -v node &> /dev/null; then
        print_warning "Node.js not found. You'll need it for local frontend development."
        print_info "Visit: https://nodejs.org/ to install Node.js"
    else
        print_status "Node.js found"
    fi

    # Check for Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 not found. Please install Python 3 first."
        exit 1
    else
        print_status "Python 3 found"
    fi
}

# Main setup function
main() {
    clear
    echo -e "${PURPLE}🎓 Databricks MCP Workshop Setup${NC}"
    echo -e "${PURPLE}===================================${NC}"
    echo ""
    echo "This script will set up your personal workshop environment with:"
    echo "• Your own Unity Catalog with sample data"
    echo "• Your own Databricks App instance"
    echo "• Custom MCP server configuration"
    echo "• Local development environment"
    echo ""

    # Install dependencies first
    install_dependencies

    # Get participant information
    print_header "👤 Participant Setup"

    # Get current system username as default
    CURRENT_USER=$(whoami)
    prompt_with_default "Enter your workshop username/identifier" "$CURRENT_USER" "PARTICIPANT_NAME"

    # Clean the username for resource naming
    CLEAN_PREFIX=$(clean_username "$PARTICIPANT_NAME")

    print_info "Your resource prefix will be: ${CLEAN_PREFIX}"
    print_info "This will create resources like:"
    print_info "  • Catalog: mcp_workshop_${CLEAN_PREFIX}"
    print_info "  • App: mcp-workshop-app-${CLEAN_PREFIX}"
    print_info "  • MCP Server: databricks-mcp-${CLEAN_PREFIX}"
    echo ""

    read -p "$(echo -e "${BLUE}❓${NC} Continue with this setup? (y/N): ")" confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi

    # Databricks Authentication Setup
    print_header "🔐 Databricks Authentication"

    # Check if .env.local already exists
    if [ -f ".env.local" ]; then
        print_info "Found existing .env.local file."
        read -p "$(echo -e "${BLUE}❓${NC} Do you want to update it? (y/N): ")" update_env
        if [[ ! "$update_env" =~ ^[Yy]$ ]]; then
            print_info "Using existing configuration."
            source .env.local 2>/dev/null || true
            skip_auth=true
        fi
    fi

    if [ "$skip_auth" != "true" ]; then
        # Initialize .env.local file if it doesn't exist
        if [ ! -f ".env.local" ]; then
            echo "# Databricks MCP Workshop Configuration" > .env.local
            echo "# Generated on $(date)" >> .env.local
            echo "# Participant: $PARTICIPANT_NAME" >> .env.local
            echo "" >> .env.local
        fi

        echo "Choose authentication method:"
        echo "1. Personal Access Token (PAT) - Recommended"
        echo "2. Configuration Profile"
        echo ""

        read -p "$(echo -e "${BLUE}❓${NC} Select option (1 or 2): ")" auth_choice

        if [ "$auth_choice" = "1" ]; then
            # PAT Authentication
            print_progress "Setting up Personal Access Token authentication..."

            update_env_value "DATABRICKS_AUTH_TYPE" "pat" "Authentication method"

            if [ -z "$DATABRICKS_HOST" ]; then
                prompt_with_default "Databricks Workspace URL" "https://your-workspace.cloud.databricks.com" "DATABRICKS_HOST"
            else
                prompt_with_default "Databricks Workspace URL" "$DATABRICKS_HOST" "DATABRICKS_HOST"
            fi

            update_env_value "DATABRICKS_HOST" "$DATABRICKS_HOST" "Databricks workspace URL"

            if [ -z "$DATABRICKS_TOKEN" ]; then
                echo ""
                print_info "Create a Personal Access Token here:"
                print_info "🔗 $DATABRICKS_HOST/settings/user/developer/access-tokens"
                echo ""
                read -s -p "$(echo -e "${BLUE}🔑${NC} Enter your Databricks Personal Access Token: ")" DATABRICKS_TOKEN
                echo ""
            fi

            update_env_value "DATABRICKS_TOKEN" "$DATABRICKS_TOKEN"

            # Test PAT authentication
            export DATABRICKS_HOST="$DATABRICKS_HOST"
            export DATABRICKS_TOKEN="$DATABRICKS_TOKEN"

            if ! test_databricks_connection; then
                print_error "Authentication failed. Please check your host URL and token."
                exit 1
            fi

        elif [ "$auth_choice" = "2" ]; then
            # Profile Authentication
            print_progress "Setting up configuration profile authentication..."

            update_env_value "DATABRICKS_AUTH_TYPE" "profile" "Authentication method"

            # List existing profiles
            print_info "Available profiles:"
            if [ -f "$HOME/.databrickscfg" ]; then
                grep '^\[' "$HOME/.databrickscfg" | sed 's/\[//g' | sed 's/\]//g' | sed 's/^/  - /'
            else
                print_info "  No existing profiles found"
            fi
            echo ""

            prompt_with_default "Databricks Config Profile" "${DATABRICKS_CONFIG_PROFILE:-DEFAULT}" "DATABRICKS_CONFIG_PROFILE"

            update_env_value "DATABRICKS_CONFIG_PROFILE" "$DATABRICKS_CONFIG_PROFILE" "Databricks profile name"

            # Clear PAT credentials when using profile
            update_env_value "DATABRICKS_HOST" ""
            update_env_value "DATABRICKS_TOKEN" ""

            # Test profile authentication
            if ! test_databricks_connection "$DATABRICKS_CONFIG_PROFILE"; then
                print_error "Profile '$DATABRICKS_CONFIG_PROFILE' not found or invalid."
                print_info "Configure it with: databricks configure --profile $DATABRICKS_CONFIG_PROFILE"
                exit 1
            fi

        else
            print_error "Invalid option. Please run setup again."
            exit 1
        fi
    fi

    # Generate user-specific configuration
    print_header "⚙️ Generating Workshop Configuration"

    # Create user-specific resource names
    WORKSHOP_CATALOG="mcp_workshop_${CLEAN_PREFIX}"
    WORKSHOP_APP_NAME="mcp-workshop-app-${CLEAN_PREFIX}"
    MCP_SERVER_NAME="databricks-mcp-${CLEAN_PREFIX}"

    # Update configuration
    update_env_value "PARTICIPANT_NAME" "$PARTICIPANT_NAME" "Workshop participant information"
    update_env_value "PARTICIPANT_PREFIX" "$CLEAN_PREFIX"
    update_env_value "WORKSHOP_CATALOG" "$WORKSHOP_CATALOG" "Workshop resources"
    update_env_value "WORKSHOP_APP_NAME" "$WORKSHOP_APP_NAME"
    update_env_value "MCP_SERVER_NAME" "$MCP_SERVER_NAME"

    print_status "Configuration saved to .env.local"

    # Store participant info for later cleanup reference
    cat > ".participant_${CLEAN_PREFIX}.info" << EOF
# Workshop participant information
PARTICIPANT_NAME="${PARTICIPANT_NAME}"
PARTICIPANT_PREFIX="${CLEAN_PREFIX}"
WORKSHOP_CATALOG="${WORKSHOP_CATALOG}"
WORKSHOP_APP_NAME="${WORKSHOP_APP_NAME}"
MCP_SERVER_NAME="${MCP_SERVER_NAME}"
CREATED_DATE="$(date)"
EOF

    print_status "Saved participant configuration for cleanup reference"

    # Deploy workshop resources
    print_header "🚀 Deploying Your Workshop Environment"
    print_info "This will create your personal workshop resources..."

    print_progress "Deploying Databricks bundle (workshop app + MCP server)..."
    if databricks bundle deploy -t dev \
        --var="participant_prefix=${CLEAN_PREFIX}" \
        --var="workshop_catalog=${WORKSHOP_CATALOG}" \
        --var="app_name=${WORKSHOP_APP_NAME}" \
        --var="mcp_server_name=${MCP_SERVER_NAME}"; then
        print_status "Bundle deployed successfully"
    else
        print_error "Bundle deployment failed"
        exit 1
    fi

    print_progress "Setting up your workshop catalog and sample data..."
    if databricks bundle run setup_workshop_resources -t dev \
        --var="participant_prefix=${CLEAN_PREFIX}" \
        --var="workshop_catalog=${WORKSHOP_CATALOG}" \
        --var="app_name=${WORKSHOP_APP_NAME}"; then
        print_status "Workshop resources created successfully"
    else
        print_warning "Resource setup encountered issues, but continuing..."
    fi

    # Set up custom MCP server template
    print_header "⚙️ Setting Up Your Custom MCP Server"
    print_info "Configuring the custom MCP server template for hands-on learning..."

    if [ -d "custom-mcp-template" ]; then
        cd custom-mcp-template

        # Run the MCP-specific setup
        if [ -f "setup_workshop_mcp.sh" ]; then
            print_progress "Configuring custom MCP server template..."
            print_info "Parameters: ${CLEAN_PREFIX}, ${MCP_SERVER_NAME}, ${DATABRICKS_HOST}"
            ./setup_workshop_mcp.sh "${CLEAN_PREFIX}" "${MCP_SERVER_NAME}" "${DATABRICKS_HOST}"
            print_status "Custom MCP server template configured"
        else
            print_warning "MCP setup script not found, setting up manually..."

            # Manual setup fallback
            cat > config.yaml << EOF
# MCP Server Configuration for ${PARTICIPANT_NAME}
servername: ${MCP_SERVER_NAME}
EOF

            cat > .env.local << EOF
# Workshop MCP Server Configuration for ${PARTICIPANT_NAME}
DATABRICKS_HOST=${DATABRICKS_HOST}
SERVER_NAME=${MCP_SERVER_NAME}
EOF
            print_status "Basic MCP configuration created"
        fi

        cd ..
    else
        print_warning "Custom MCP template directory not found"
    fi

    # Install frontend dependencies
    if [ -d "frontend" ] && command -v npm &> /dev/null; then
        print_progress "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_status "Frontend dependencies installed"

        # Update frontend environment for this participant
        cat > "frontend/.env.local" << EOF
NEXT_PUBLIC_WORKSHOP_CATALOG=${WORKSHOP_CATALOG}
NEXT_PUBLIC_PARTICIPANT_NAME=${PARTICIPANT_NAME}
NEXT_PUBLIC_DATABRICKS_HOST=${DATABRICKS_HOST}
EOF
        print_status "Frontend configured for your workshop instance"
    fi

    # Setup complete!
    print_header "🎉 Workshop Setup Complete!"
    echo ""
    print_status "Your personal workshop environment is ready!"
    echo ""
    echo -e "${CYAN}📋 Your Workshop Resources:${NC}"
    echo "   • Catalog: ${WORKSHOP_CATALOG}"
    echo "   • App: ${WORKSHOP_APP_NAME}"
    echo "   • MCP Server: ${MCP_SERVER_NAME}"
    echo ""
    echo -e "${CYAN}🚀 Next Steps:${NC}"
    echo "   1. Start the frontend: cd frontend && npm run dev"
    echo "   2. Visit: http://localhost:3000"
    echo "   3. Your Databricks App will be available shortly at:"
    echo "      https://your-workspace.databricksapps.com (check Apps page)"
    echo ""
    echo -e "${CYAN}🔧 Configuration Files Created:${NC}"
    echo "   • .env.local - Your workshop configuration"
    echo "   • .participant_${CLEAN_PREFIX}.info - Participant info for cleanup"
    echo "   • frontend/.env.local - Frontend configuration"
    echo ""
    echo -e "${GREEN}Happy learning with Databricks MCP! 🚀${NC}"

    # Optional: Open browser to localhost
    if command -v open &> /dev/null; then
        read -p "$(echo -e "${BLUE}❓${NC} Open workshop in browser? (y/N): ")" open_browser
        if [[ "$open_browser" =~ ^[Yy]$ ]]; then
            print_info "Opening workshop in your browser..."
            (cd frontend && npm run dev &)
            sleep 3
            open "http://localhost:3000"
        fi
    fi
}

# Run main function
main "$@"