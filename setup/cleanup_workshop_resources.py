# Databricks notebook source
# MAGIC %md
# MAGIC # Cleanup Workshop Resources
# MAGIC 
# MAGIC This notebook cleans up the resources created for the MCP workshop.

# COMMAND ----------

# MAGIC %python
# MAGIC 
# MAGIC # Get parameters
# MAGIC catalog_name = dbutils.widgets.get("catalog_name") if "dbutils" in globals() else "mcp_workshop"
# MAGIC 
# MAGIC print(f"Cleaning up workshop resources for catalog: {catalog_name}")

# COMMAND ----------

# MAGIC %sql
# MAGIC 
# MAGIC -- Drop tables
# MAGIC DROP TABLE IF EXISTS ${catalog_name}.default.sales;
# MAGIC DROP TABLE IF EXISTS ${catalog_name}.default.customers;
# MAGIC DROP TABLE IF EXISTS ${catalog_name}.default.products;

# COMMAND ----------

# MAGIC %sql
# MAGIC 
# MAGIC -- Drop schema and catalog (optional - uncomment if you want to completely remove)
# MAGIC -- DROP SCHEMA IF EXISTS ${catalog_name}.default CASCADE;
# MAGIC -- DROP CATALOG IF EXISTS ${catalog_name} CASCADE;

# COMMAND ----------

# MAGIC %python
# MAGIC 
# MAGIC print("✅ Workshop cleanup complete!")
# MAGIC print(f"Removed tables from {catalog_name}.default")
# MAGIC print("Note: Catalog and schema were preserved (uncomment SQL above to remove completely)")
