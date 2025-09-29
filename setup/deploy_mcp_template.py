# Databricks notebook source
# MAGIC %md
# MAGIC # Deploy MCP Template
# MAGIC
# MAGIC This notebook deploys the custom MCP server template to the workspace for participant use.

# COMMAND ----------

# MAGIC %python

import os
import shutil
from pathlib import Path

# Get parameters
participant_prefix = dbutils.widgets.get("participant_prefix") if "dbutils" in globals() else "default"
mcp_server_name = dbutils.widgets.get("mcp_server_name") if "dbutils" in globals() else "databricks-mcp-workshop"

print(f"Deploying MCP template for participant: {participant_prefix}")
print(f"MCP server name: {mcp_server_name}")

# COMMAND ----------

# MAGIC %python

# Create the workspace directory path for the MCP server
current_user = spark.sql("SELECT current_user() as user").collect()[0]["user"]
mcp_server_path = f"/Workspace/Users/{current_user}/{mcp_server_name}"

print(f"Target workspace path: {mcp_server_path}")

# COMMAND ----------

# MAGIC %python

# Copy custom-mcp-template files to workspace
# Note: In a real deployment, you would use the Workspace API to upload files
# For this workshop, we'll create a simple script that participants can run

template_sync_script = f'''#!/bin/bash
# MCP Template Sync Script for {participant_prefix}
# This script syncs the custom-mcp-template to your Databricks workspace

echo "🚀 Deploying custom MCP server template for {participant_prefix}"

# Create workspace directory
databricks workspace mkdirs "{mcp_server_path}"

# Sync template files to workspace
echo "📁 Syncing template files..."
find ./custom-mcp-template -type f -name "*.py" -o -name "*.yaml" -o -name "*.toml" -o -name "*.md" | while read file; do
    relative_path=${{file#./custom-mcp-template/}}
    workspace_file="{mcp_server_path}/${{relative_path}}"
    echo "  Uploading $file -> $workspace_file"
    databricks workspace import "$file" "$workspace_file" --format AUTO --overwrite
done

echo "✅ MCP server template deployed to {mcp_server_path}"
echo "🔧 You can now modify and deploy your custom MCP server!"
'''

# Write the sync script to a local file
with open(f"/tmp/sync_mcp_template_{participant_prefix}.sh", "w") as f:
    f.write(template_sync_script)

print("📝 Created MCP template sync script")
print(f"Script location: /tmp/sync_mcp_template_{participant_prefix}.sh")

# COMMAND ----------

# MAGIC %python

print("✅ MCP template deployment setup complete!")
print(f"Participant: {participant_prefix}")
print(f"MCP server: {mcp_server_name}")
print(f"Workspace path: {mcp_server_path}")
print("")
print("🎯 Next steps:")
print("1. Run the sync script to upload template files")
print("2. Modify tools in server/tools.py via workspace")
print("3. Deploy the custom MCP server as a Databricks App")
print("4. Test with local development environment")