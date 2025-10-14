# Serverless Workspace Support

## Overview

The workshop now supports both **regular** and **serverless** Databricks workspaces. Serverless workspaces require catalogs to be created via the UI with Unity Catalog Managed Storage, or use existing catalogs.

## Changes Made

### 1. Interactive Catalog Setup (`setup.sh`)

When running `./setup.sh`, participants are now prompted:

```
❓ Do you want to:
   1. Create a new catalog (default - requires catalog creation permissions)
   2. Use an existing catalog (recommended for serverless workspaces)
Choose option (1/2) [1]:
```

**Option 1 (Create New):**
- Creates `mcp_workshop_<prefix>` catalog
- Works for regular workspaces
- Will fail gracefully on serverless workspaces with helpful instructions

**Option 2 (Use Existing):**
- Lists available catalogs in the workspace
- Prompts user to enter catalog name
- Uses existing catalog for workshop data

### 2. Smart Catalog Creation (`create_workshop_catalog.py`)

The notebook now:
- ✅ Checks if catalog exists first
- ✅ Only attempts creation if `create_catalog=true` and catalog doesn't exist
- ✅ Provides detailed error messages for serverless workspaces
- ✅ Creates default schema in the catalog

### 3. Configuration Storage

The catalog choice is stored in:
- `.env.local` - `CREATE_CATALOG` variable
- `.participant_<prefix>.info` - For cleanup tracking

## Error Handling for Serverless Workspaces

If catalog creation fails on a serverless workspace, users see:

```
================================================================================
❌ ERROR: Serverless workspace detected!
================================================================================

Your workspace requires a storage location for catalogs.

📋 Options to fix this:

  Option 1: Create catalog via Databricks UI
  ----------------------------------------
     1. Go to Data Explorer > Create Catalog
     2. Name it: mcp_workshop_jai
     3. Select 'Unity Catalog Managed Storage'
     4. Then re-run: ./setup.sh

  Option 2: Use an existing catalog
  ---------------------------------
     1. Re-run: ./setup.sh
     2. Choose option 2 (use existing catalog)
     3. Enter the name of your existing catalog

================================================================================
```

## Testing

### Test Case 1: Regular Workspace (Create New Catalog)
```bash
./setup.sh
# Choose option 1
# Catalog mcp_workshop_<prefix> will be created
```

### Test Case 2: Serverless Workspace (Use Existing)
```bash
./setup.sh
# Choose option 2
# Enter existing catalog name (e.g., "main")
# Workshop data created in specified catalog
```

### Test Case 3: Serverless Workspace (Create Fails)
```bash
./setup.sh
# Choose option 1
# Creation fails with helpful error message
# User creates catalog via UI
# Re-run setup.sh and it succeeds
```

## Backwards Compatibility

✅ Default behavior unchanged - creates new catalog
✅ Existing automation scripts work (pass `--var="create_catalog=true"`)
✅ Manual override supported via bundle variables

## Bundle Configuration

Updated `databricks.yml` with:
```yaml
variables:
  create_catalog:
    description: "Whether to create catalog or use existing (true/false)"
    default: "true"
```

Jobs can override:
```bash
databricks bundle deploy -t dev \
  --var="workshop_catalog=my_catalog" \
  --var="create_catalog=false"
```

## Cleanup Considerations

The cleanup script respects the catalog source:
- If `CREATE_CATALOG=true` in `.participant_<prefix>.info`, catalog will be deleted
- If `CREATE_CATALOG=false`, only workshop data is removed (catalog preserved)

