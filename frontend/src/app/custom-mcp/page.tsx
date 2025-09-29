import WorkshopStep from "@/components/WorkshopStep";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export default function CustomMcpPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-4xl text-white shadow-lg">
              🛠️
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-2">Hands-On: Custom MCP Server</h1>
              <p className="text-xl text-slate-600">Build your own SQL-powered MCP server right here!</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">✨ Workshop Setup Complete!</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Your workshop setup has already configured a custom MCP server template in the
              <code className="bg-orange-200 px-2 py-1 rounded mx-2">custom-mcp-template/</code>
              directory. Let's build your own SQL tools and deploy them!
            </p>
          </div>

          <InfoBox type="success" title="🎉 You already have everything set up!">
            <ul className="space-y-2 mt-3">
              <li>• ✅ Custom MCP server template configured for you</li>
              <li>• ✅ Your personal Databricks App deployed</li>
              <li>• ✅ Local development environment ready</li>
              <li>• ✅ SQL warehouse and sample data accessible</li>
              <li>• ⚡ Time to build your own MCP tools!</li>
            </ul>
          </InfoBox>
        </div>

        <WorkshopStep number={1} title="Explore Your Custom MCP Server Template">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Your workshop setup has already created a custom MCP server template in your local directory.
            Let's explore what's been set up for you and understand the structure.
          </p>

          <CodeBlock
            language="bash"
            title="Explore Your MCP Template"
            code={`# Navigate to your custom MCP template
cd custom-mcp-template

# See what's been configured for you
ls -la

# Check your personalized server configuration
cat config.yaml

# View your environment setup
cat .env.local`}
          />

          <InfoBox type="success" title="✨ What's Already Set Up">
            <ul className="space-y-2 mt-3">
              <li>• FastMCP framework with SQL warehouse integration</li>
              <li>• Your personalized server name and configuration</li>
              <li>• Authentication setup using your Databricks credentials</li>
              <li>• Sample SQL tools for querying your workshop data</li>
              <li>• Deployment scripts for Databricks Apps</li>
            </ul>
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={2} title="Examine the Existing SQL Tools">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            The template already includes powerful SQL tools that work with your workshop data.
            Let's look at what's available and understand how they work.
          </p>

          <CodeBlock
            language="bash"
            title="Explore the Existing Tools"
            code={`# Look at the existing SQL tools
cd custom-mcp-template
cat server/tools.py

# Check what sample data is available in your catalog
cat ../setup/setup_sample_data.py`}
          />

          <InfoBox type="info" title="📊 Built-in SQL Tools">
            Your template includes tools like:
            <ul className="mt-3 space-y-1">
              <li>• <code>execute_dbsql</code> - Execute any SQL query</li>
              <li>• <code>list_warehouses</code> - Show available SQL warehouses</li>
              <li>• <code>list_dbfs_files</code> - Browse files in DBFS</li>
              <li>• <code>health</code> - Check server connection</li>
            </ul>
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={3} title="Create Your Custom Business Tools">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Now let's add custom SQL tools that work with your workshop data. We'll create tools
            that analyze the sample products, customers, and sales data.
          </p>

          <CodeBlock
            language="python"
            title="Add a Daily Sales Tool"
            code={`# Open custom-mcp-template/server/tools.py and add this function:

@mcp_server.tool
def get_daily_sales_summary(limit: int = 10) -> dict:
    """Get a summary of recent sales from your workshop data.

    Args:
        limit: Number of recent sales to show (default: 10)
    """
    try:
        w = get_workspace_client()
        warehouse_id = os.environ.get('DATABRICKS_SQL_WAREHOUSE_ID')

        # Use your personal workshop catalog
        catalog_name = os.environ.get('WORKSHOP_CATALOG', 'mcp_workshop_default')

        query = f"""
        SELECT
            s.sale_id,
            s.sale_date,
            c.customer_name,
            p.product_name,
            s.quantity,
            s.revenue
        FROM {catalog_name}.default.sales s
        JOIN {catalog_name}.default.customers c ON s.customer_id = c.customer_id
        JOIN {catalog_name}.default.products p ON s.product_id = p.product_id
        ORDER BY s.sale_date DESC
        LIMIT {limit}
        """

        result = w.statement_execution.execute_statement(
            warehouse_id=warehouse_id,
            statement=query,
            wait_timeout='30s'
        )

        if result.result and result.result.data_array:
            sales = []
            for row in result.result.data_array:
                sales.append({
                    'sale_id': row[0],
                    'sale_date': row[1],
                    'customer_name': row[2],
                    'product_name': row[3],
                    'quantity': row[4],
                    'revenue': float(row[5])
                })

            return {
                'success': True,
                'data': {
                    'recent_sales': sales,
                    'total_sales': len(sales)
                }
            }

        return {'success': True, 'data': {'message': 'No sales found'}}

    except Exception as e:
        return {'success': False, 'error': str(e)}`}
          />

          <InfoBox type="tip" title="💡 Using Your Workshop Data">
            This tool queries YOUR personal workshop data using your catalog name. The workshop setup
            created sample products, customers, and sales data just for you!
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={4} title="Test Your MCP Server Locally">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Let's start your custom MCP server locally and test that your new tools work with
            your workshop data.
          </p>

          <CodeBlock
            language="bash"
            title="Start Your MCP Server"
            code={`# Navigate to your MCP template directory
cd custom-mcp-template

# Start the development server (this includes hot-reload!)
./watch.sh

# Your server will be available at:
# - HTTP homepage: http://localhost:8000
# - MCP endpoint: http://localhost:8000/mcp/`}
          />

          <CodeBlock
            language="bash"
            title="Test Your New Sales Tool"
            code={`# Test that your tools are available
curl -X POST http://localhost:8000/mcp/ \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": "test", "method": "tools/list"}'

# Test your custom sales tool
curl -X POST http://localhost:8000/mcp/ \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": "test", "method": "tools/call", "params": {"name": "get_daily_sales_summary", "arguments": {"limit": 5}}}'`}
          />

          <InfoBox type="success" title="🎉 Your MCP Server is Running!">
            If you see your sales data in the response, congratulations! Your custom MCP server
            is successfully querying your workshop data.
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={5} title="Deploy to Databricks Apps">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Deploy your MCP server as a production Databricks App with OAuth authentication
            and automatic scaling.
          </p>

          <CodeBlock
            language="bash"
            title="Production Deployment"
            code={`# Deploy to Databricks Apps
./deploy.sh

# Check deployment status and get your app URL
./app_status.sh

# Example output:
# App Status: RUNNING
# App URL: https://your-app-abc123.databricksapps.com
# MCP Endpoint: https://your-app-abc123.databricksapps.com/mcp/`}
          />

          <InfoBox type="success" title="Production Ready">
            Your MCP server is now running with OAuth authentication, automatic SSL,
            and enterprise-grade security provided by Databricks Apps.
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={6} title="Connect to Cursor IDE">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Integrate your custom MCP server with Cursor IDE for AI-powered development
            workflows with your business data.
          </p>

          <CodeBlock
            language="bash"
            title="Install MCP Proxy for Cursor"
            code={`# Install the MCP proxy globally
pip install git+https://github.com/YOUR-USERNAME/my-databricks-mcp.git

# Or install with uvx for isolated execution
uvx --from git+https://github.com/YOUR-USERNAME/my-databricks-mcp.git dba-mcp-proxy --help`}
          />

          <CodeBlock
            language="json"
            title="Cursor MCP Configuration (.cursor/mcp.json)"
            code={`{
  "mcpServers": {
    "my-custom-databricks": {
      "command": "uvx",
      "args": [
        "--from", "git+https://github.com/YOUR-USERNAME/my-databricks-mcp.git",
        "dba-mcp-proxy",
        "--databricks-host", "https://your-workspace.cloud.databricks.com",
        "--databricks-app-url", "https://your-app-abc123.databricksapps.com"
      ],
      "env": {
        "DATABRICKS_HOST": "https://your-workspace.cloud.databricks.com"
      }
    }
  }
}`}
          />

          <InfoBox type="tip" title="Cursor Integration">
            After adding the configuration, restart Cursor. Your custom SQL tools will be available
            in chat conversations, allowing AI to query your business data directly.
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={7} title="Use with Databricks AI Playground">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Connect your MCP server to Databricks AI Playground for interactive data analysis
            and business intelligence workflows.
          </p>

          <CodeBlock
            language="python"
            title="AI Playground Integration"
            code={`# In Databricks AI Playground, you can now reference your MCP tools:

# Prompt example:
"""
Use my custom MCP server to analyze today's revenue performance.
Call the get_daily_revenue tool with today's date and compare it
to our average daily revenue over the past 30 days.

Then use the analyze_customer_segments tool to see which customer
segments are driving the most value this month.
"""

# The AI can now execute your custom SQL tools and provide insights`}
          />

          <InfoBox type="info" title="AI Playground Features">
            <ul className="space-y-2 mt-3">
              <li>• Natural language to SQL via your custom tools</li>
              <li>• Real-time business metrics and KPI reporting</li>
              <li>• Customer segmentation and behavior analysis</li>
              <li>• Integration with existing Databricks notebooks and workflows</li>
            </ul>
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={8} title="Advanced Configuration">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Configure advanced features like custom prompts, multiple warehouses,
            and business-specific integrations.
          </p>

          <CodeBlock
            language="markdown"
            title="prompts/business_insights.md"
            code={`# Business Intelligence Assistant

You are a business intelligence assistant with access to our company's
data through custom SQL tools. You can:

- Analyze daily, weekly, and monthly revenue trends
- Segment customers based on behavior and value
- Generate executive dashboards and reports
- Identify growth opportunities and performance gaps

Use the available tools to provide data-driven insights and recommendations.

Available tools:
- get_daily_revenue: Daily revenue metrics
- analyze_customer_segments: Customer behavior analysis
- execute_dbsql: Custom SQL queries`}
          />

          <CodeBlock
            language="yaml"
            title="config.yaml - Server Configuration"
            code={`# Custom server configuration
servername: my-business-analytics-mcp

# Additional settings for your deployment
features:
  - sql_tools
  - custom_analytics
  - business_prompts

warehouse_configs:
  default: "your-default-warehouse-id"
  analytics: "your-analytics-warehouse-id"
  reporting: "your-reporting-warehouse-id"`}
          />
        </WorkshopStep>

        {/* Architecture Overview */}
        <div className="mb-12 p-8 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">🏗️ Architecture Overview</h3>

          <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
            <CodeBlock
              language="text"
              title="End-to-End Flow"
              code={`┌─────────────────┐    MCP Protocol     ┌──────────────────┐    OAuth + HTTPS    ┌─────────────────────┐
│   Cursor IDE    │ ◄─────────────────► │   MCP Proxy      │ ◄─────────────────► │  Databricks App     │
│   AI Playground │   (stdio/JSON-RPC)  │  (Local Process) │   (Authenticated)   │  (Your MCP Server)  │
└─────────────────┘                     └──────────────────┘                     └─────────────────────┘
                                                │                                            │
                                                │                                            ▼
                                                └──────────── Databricks Auth ─────► SQL Warehouses
                                                                                       Unity Catalog
                                                                                       DBFS & APIs`}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">🔧 Core Components</h4>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• <strong>FastMCP Server:</strong> Python-based MCP implementation</li>
                <li>• <strong>SQL Tools:</strong> Execute queries against warehouses</li>
                <li>• <strong>OAuth Proxy:</strong> Handles Databricks authentication</li>
                <li>• <strong>Databricks App:</strong> Managed hosting and scaling</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">🚀 Key Features</h4>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• <strong>Production Ready:</strong> Enterprise authentication & security</li>
                <li>• <strong>SQL Integration:</strong> Direct warehouse and Unity Catalog access</li>
                <li>• <strong>Hot Reload:</strong> Development server with live updates</li>
                <li>• <strong>Multi-Client:</strong> Works with Cursor, Claude, AI Playground</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-12 p-8 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">🔧 Troubleshooting</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Authentication Issues</h4>
              <CodeBlock
                language="bash"
                code={`# Refresh Databricks credentials
databricks auth login --host https://your-workspace.cloud.databricks.com

# Test authentication
databricks current-user me

# Clear cached tokens if needed
uvx cache clean`}
              />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Connection Problems</h4>
              <CodeBlock
                language="bash"
                code={`# Test MCP server directly
curl -X GET https://your-app.databricksapps.com/mcp/

# Check app status
./app_status.sh

# View server logs
curl https://your-app.databricksapps.com/logz`}
              />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Development Issues</h4>
              <CodeBlock
                language="bash"
                code={`# Restart development server
./watch.sh

# Run comprehensive tests
./claude_scripts/test_local_mcp_curl.sh
./claude_scripts/test_local_mcp_proxy.sh

# Interactive debugging
./claude_scripts/inspect_local_mcp.sh`}
              />
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-16 p-8 rounded-2xl border-2 border-orange-200 bg-orange-50">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">🎉 Section Complete!</h3>
          <p className="text-lg text-slate-700 mb-6">
            You now have a production-ready custom MCP server that integrates SQL warehouses
            with AI development workflows. Your tools are available in Cursor IDE,
            Databricks AI Playground, and any MCP-compatible client.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/local-ide"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-lg font-bold text-white hover:bg-orange-700 transition-colors"
            >
              Next: Local IDE Setup
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="https://github.com/databricks-solutions/custom-mcp-databricks-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Template Repository
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <a
              href="https://fastmcp.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              FastMCP Docs
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
