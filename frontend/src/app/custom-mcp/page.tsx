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
              ⚙️
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-2">Custom MCP Servers</h1>
              <p className="text-xl text-slate-600">Build SQL-powered MCP servers with Databricks</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Production-Ready MCP Server Template</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Use the official Databricks MCP server template to build custom SQL-powered tools that integrate
              seamlessly with Cursor IDE, Databricks AI Playground, and any MCP-compatible client.
            </p>
          </div>

          <InfoBox type="info" title="What you&apos;ll learn">
            <ul className="space-y-2 mt-3">
              <li>• Deploy a production-ready MCP server template</li>
              <li>• Create custom SQL tools for your business logic</li>
              <li>• Integrate with Cursor IDE for development workflows</li>
              <li>• Connect to Databricks AI Playground for data analysis</li>
              <li>• Manage authentication and deployment on Databricks Apps</li>
            </ul>
          </InfoBox>
        </div>

        <WorkshopStep number={1} title="Create Your MCP Server from Template">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Start by creating your own MCP server repository from the official Databricks template.
            This template includes SQL warehouse integration, authentication, and deployment scripts.
          </p>

          <CodeBlock
            language="bash"
            title="Create Repository from Template"
            code={`# Option 1: Use GitHub CLI (recommended)
gh repo create my-databricks-mcp --template databricks-solutions/custom-mcp-databricks-app --private

# Option 2: Use the GitHub web interface
# Visit: https://github.com/databricks-solutions/custom-mcp-databricks-app
# Click "Use this template" → "Create a new repository"`}
          />

          <InfoBox type="tip" title="Template Features">
            The template includes FastMCP framework, SQL warehouse tools, OAuth authentication,
            deployment scripts, and comprehensive testing utilities out of the box.
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={2} title="Clone and Setup Locally">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Clone your new repository and run the interactive setup to configure authentication
            and server settings.
          </p>

          <CodeBlock
            language="bash"
            title="Local Setup"
            code={`# Clone your repository
git clone https://github.com/YOUR-USERNAME/my-databricks-mcp.git
cd my-databricks-mcp

# Run interactive setup (configures auth, server name, dependencies)
./setup.sh

# This creates .env.local with your Databricks configuration:
# DATABRICKS_HOST=https://your-workspace.cloud.databricks.com
# DATABRICKS_SQL_WAREHOUSE_ID=your-warehouse-id
# SERVER_NAME=your-custom-server-name`}
          />

          <InfoBox type="warning" title="Prerequisites">
            Make sure you have the Databricks CLI installed and configured: <code>pip install databricks-cli && databricks configure</code>
          </InfoBox>
        </WorkshopStep>

        <WorkshopStep number={3} title="Add Custom SQL Tools">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            The template comes with built-in SQL tools. Add your own business-specific tools by
            extending the <code>server/tools.py</code> file with custom functions.
          </p>

          <CodeBlock
            language="python"
            title="server/tools.py - Add Custom Tools"
            code={`# Add this to your server/tools.py file
@mcp_server.tool
def get_daily_revenue(date: str, catalog: str = "main", schema: str = "analytics") -> dict:
    """Get daily revenue metrics for a specific date.

    Args:
        date: Date in YYYY-MM-DD format
        catalog: Catalog name (default: main)
        schema: Schema name (default: analytics)
    """
    try:
        w = WorkspaceClient(
            host=os.environ.get('DATABRICKS_HOST'),
            token=os.environ.get('DATABRICKS_TOKEN')
        )

        warehouse_id = os.environ.get('DATABRICKS_SQL_WAREHOUSE_ID')

        query = f"""
        SELECT
            DATE(order_timestamp) as date,
            COUNT(*) as total_orders,
            SUM(order_amount) as total_revenue,
            AVG(order_amount) as avg_order_value
        FROM {catalog}.{schema}.orders
        WHERE DATE(order_timestamp) = '{date}'
        GROUP BY DATE(order_timestamp)
        """

        result = w.statement_execution.execute_statement(
            warehouse_id=warehouse_id,
            statement=query,
            wait_timeout='30s'
        )

        if result.result and result.result.data_array:
            row = result.result.data_array[0]
            return {
                'success': True,
                'data': {
                    'date': row[0],
                    'total_orders': row[1],
                    'total_revenue': float(row[2]),
                    'avg_order_value': float(row[3])
                }
            }

        return {'success': True, 'data': {'message': 'No data for this date'}}

    except Exception as e:
        return {'success': False, 'error': str(e)}`}
          />

          <CodeBlock
            language="python"
            title="Add Customer Analysis Tool"
            code={`@mcp_server.tool
def analyze_customer_segments(months: int = 6) -> dict:
    """Analyze customer segments based on purchase behavior.

    Args:
        months: Number of months to analyze (default: 6)
    """
    query = f"""
    WITH customer_metrics AS (
        SELECT
            customer_id,
            COUNT(*) as order_count,
            SUM(order_amount) as total_spent,
            AVG(order_amount) as avg_order,
            MAX(order_timestamp) as last_order
        FROM main.analytics.orders
        WHERE order_timestamp >= CURRENT_DATE - INTERVAL {months} MONTH
        GROUP BY customer_id
    )
    SELECT
        CASE
            WHEN total_spent > 1000 THEN 'High Value'
            WHEN total_spent > 500 THEN 'Medium Value'
            ELSE 'Low Value'
        END as segment,
        COUNT(*) as customer_count,
        AVG(total_spent) as avg_lifetime_value
    FROM customer_metrics
    GROUP BY segment
    ORDER BY avg_lifetime_value DESC
    """

    # Execute using the same pattern as above...
    # Returns customer segment analysis`}
          />
        </WorkshopStep>

        <WorkshopStep number={4} title="Test Locally with Development Server">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Start your MCP server locally for development and testing. The template includes
            hot-reload and comprehensive testing scripts.
          </p>

          <CodeBlock
            language="bash"
            title="Local Development"
            code={`# Start development server with hot reload
./watch.sh

# Server starts at http://localhost:8000
# MCP endpoint available at http://localhost:8000/mcp/

# Test your tools directly
curl -X POST http://localhost:8000/mcp/ \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": "test", "method": "tools/list"}'`}
          />

          <CodeBlock
            language="bash"
            title="Test Your Custom Tools"
            code={`# Test the MCP server with included testing scripts
./claude_scripts/test_local_mcp_curl.sh     # HTTP tests
./claude_scripts/test_local_mcp_proxy.sh    # MCP protocol tests

# Launch web-based MCP Inspector for visual testing
./claude_scripts/inspect_local_mcp.sh       # Opens browser interface`}
          />
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
