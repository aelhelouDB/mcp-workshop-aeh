# Databricks notebook source
# MAGIC %md
# MAGIC # Create Workshop Catalog
# MAGIC 
# MAGIC This notebook creates the Unity Catalog resources needed for the MCP workshop.

# COMMAND ----------

# MAGIC %python
# MAGIC 
# MAGIC import os
# MAGIC 
# MAGIC # Get parameters
# MAGIC catalog_name = dbutils.widgets.get("catalog_name") if "dbutils" in globals() else "mcp_workshop"
# MAGIC 
# MAGIC print(f"Creating catalog: {catalog_name}")
# MAGIC 
# COMMAND ----------

# MAGIC %sql
# MAGIC 
# MAGIC -- Create the workshop catalog if it doesn't exist
# MAGIC CREATE CATALOG IF NOT EXISTS ${catalog_name}
# MAGIC COMMENT 'Catalog for Databricks MCP Workshop';
# MAGIC 
# MAGIC -- Use the catalog
# MAGIC USE CATALOG ${catalog_name};
# MAGIC 
# MAGIC -- Create default schema
# MAGIC CREATE SCHEMA IF NOT EXISTS default
# MAGIC COMMENT 'Default schema for workshop tables and functions';
# MAGIC 
# MAGIC USE SCHEMA default;

# COMMAND ----------

# MAGIC %python
# MAGIC 
# MAGIC print(f"✅ Successfully created catalog: {catalog_name}")
# MAGIC print(f"✅ Created default schema")
# MAGIC print("Ready for workshop setup!")
