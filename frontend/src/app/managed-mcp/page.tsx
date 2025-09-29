import WorkshopStep from "@/components/WorkshopStep";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export default function ManagedMcpPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-4xl text-white shadow-lg">
              🔧
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-2">Managed MCP Servers</h1>
              <p className="text-xl text-slate-600">Production-ready tools with zero setup</p>
            </div>
          </div>
          
          {/* Narrative Context */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8 border-2 border-blue-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What We're Building</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Imagine you're building a customer service AI agent that needs to access your company's data and business logic. 
              Traditional approaches require building custom APIs, managing authentication, and maintaining infrastructure. 
              <strong className="text-blue-700"> Managed MCP servers eliminate this complexity entirely.</strong>
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  ❌ Traditional Approach
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Build custom REST APIs for each data source</li>
                  <li>• Manage authentication and authorization</li>
                  <li>• Handle scaling and reliability</li>
                  <li>• Maintain separate infrastructure</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  ✅ Managed MCP Approach
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Unity Catalog functions become instant tools</li>
                  <li>• Genie spaces provide natural language access</li>
                  <li>• Built-in security and governance</li>
                  <li>• Zero infrastructure to manage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Workshop Goals */}
          <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Workshop Goals</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              By the end of this section, you'll have a complete customer service agent that can:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">🔍</div>
                <h3 className="font-bold text-slate-900 mb-2">Query Customer Data</h3>
                <p className="text-sm text-slate-600">Look up order history, preferences, and account details</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">💬</div>
                <h3 className="font-bold text-slate-900 mb-2">Chat with Data</h3>
                <p className="text-sm text-slate-600">Ask natural language questions about sales and trends</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">⚡</div>
                <h3 className="font-bold text-slate-900 mb-2">Execute Business Logic</h3>
                <p className="text-sm text-slate-600">Run complex analytics and data transformations</p>
              </div>
            </div>

            <InfoBox type="info" title="What you'll learn in this section">
              <ul className="space-y-2 mt-3">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  How to create Unity Catalog functions that become MCP tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Setting up Genie spaces for natural language data access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Prototyping agents in AI Playground with your tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Testing and iterating on agent behavior
                </li>
              </ul>
            </InfoBox>
          </div>
        </div>

        {/* Workshop Steps */}
        <WorkshopStep number={1} title="Set Up Workshop Data">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              First, let's create the sample data we'll use throughout this workshop. We'll create a simple e-commerce dataset 
              with products, customers, and sales data that mirrors real-world customer service scenarios.
            </p>

            <InfoBox type="tip" title="Workshop Setup">
              <p>Run the setup notebooks in your Databricks workspace to create the <code className="bg-slate-200 px-2 py-1 rounded text-slate-800">mcp_workshop</code> catalog with sample data.</p>
            </InfoBox>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Create the Workshop Catalog</h4>
              <CodeBlock
                language="sql"
                title="Create Catalog"
                code={`-- Create the workshop catalog
CREATE CATALOG IF NOT EXISTS mcp_workshop
COMMENT 'Catalog for Databricks MCP Workshop';

-- Use the catalog
USE CATALOG mcp_workshop;

-- Create default schema
CREATE SCHEMA IF NOT EXISTS default
COMMENT 'Default schema for workshop tables and functions';

USE SCHEMA default;`}
              />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Sample Data Overview</h4>
              <p className="text-lg text-slate-700 mb-4">Our workshop data includes:</p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    <strong className="text-slate-900">products</strong> - 100 products across different categories (Electronics, Clothing, Books, etc.)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <strong className="text-slate-900">customers</strong> - 500 customers from different regions (North, South, East, West)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                    <strong className="text-slate-900">sales</strong> - 1000 sales transactions with revenue data
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </WorkshopStep>

        <WorkshopStep number={2} title="Create Unity Catalog Functions">
          <div className="space-y-8">
            <p className="text-lg text-slate-700 leading-relaxed">
              Unity Catalog functions automatically become MCP tools when accessed through managed endpoints. 
              Let's create four functions that a customer service agent would need.
            </p>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Function 1: Customer Order History</h4>
              <p className="text-slate-700 mb-4">
                Retrieve a customer's complete order history - essential for customer service inquiries.
              </p>
              <CodeBlock
                language="sql"
                title="Customer Order History Function"
                code={`CREATE OR REPLACE FUNCTION mcp_workshop.default.get_customer_orders(customer_id STRING)
RETURNS TABLE
RETURN
  SELECT
    s.sale_id,
    s.sale_date,
    p.product_name,
    p.category,
    s.quantity,
    s.revenue,
    ROUND(s.revenue / s.quantity, 2) as unit_price
  FROM mcp_workshop.default.sales s
  JOIN mcp_workshop.default.products p ON s.product_id = p.product_id
  WHERE s.customer_id = customer_id
  ORDER BY s.sale_date DESC;`}
              />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Function 2: Product Performance Analytics</h4>
              <p className="text-slate-700 mb-4">
                Analyze product performance across categories - useful for recommendations and inventory insights.
              </p>
              <CodeBlock
                language="sql"
                title="Product Performance Function"
                code={`CREATE OR REPLACE FUNCTION mcp_workshop.default.get_product_performance(category STRING DEFAULT NULL)
RETURNS TABLE
RETURN
  SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.price,
    COUNT(s.sale_id) as total_sales,
    SUM(s.quantity) as total_quantity,
    SUM(s.revenue) as total_revenue,
    AVG(s.revenue / s.quantity) as avg_selling_price,
    ROUND((AVG(s.revenue / s.quantity) - p.price) / p.price * 100, 2) as price_variance_pct
  FROM mcp_workshop.default.products p
  LEFT JOIN mcp_workshop.default.sales s ON p.product_id = s.product_id
  WHERE category IS NULL OR p.category = category
  GROUP BY p.product_id, p.product_name, p.category, p.price
  ORDER BY total_revenue DESC NULLS LAST;`}
              />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Function 3: Regional Sales Summary</h4>
              <p className="text-slate-700 mb-4">
                Get regional performance metrics - helpful for understanding customer distribution and regional trends.
              </p>
              <CodeBlock
                language="sql"
                title="Regional Sales Summary Function"
                code={`CREATE OR REPLACE FUNCTION mcp_workshop.default.get_regional_sales(region STRING DEFAULT NULL)
RETURNS TABLE
RETURN
  SELECT
    c.region,
    COUNT(DISTINCT c.customer_id) as total_customers,
    COUNT(s.sale_id) as total_orders,
    SUM(s.revenue) as total_revenue,
    AVG(s.revenue) as avg_order_value,
    SUM(s.quantity) as total_items_sold
  FROM mcp_workshop.default.customers c
  LEFT JOIN mcp_workshop.default.sales s ON c.customer_id = s.customer_id
  WHERE region IS NULL OR c.region = region
  GROUP BY c.region
  ORDER BY total_revenue DESC NULLS LAST;`}
              />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Function 4: Customer Insights</h4>
              <p className="text-slate-700 mb-4">
                Generate customer insights including lifetime value and purchase patterns.
              </p>
              <CodeBlock
                language="sql"
                title="Customer Insights Function"
                code={`CREATE OR REPLACE FUNCTION mcp_workshop.default.get_customer_insights(customer_id STRING)
RETURNS TABLE
RETURN
  SELECT
    c.customer_id,
    c.customer_name,
    c.email,
    c.region,
    c.signup_date,
    COUNT(s.sale_id) as total_orders,
    SUM(s.revenue) as lifetime_value,
    AVG(s.revenue) as avg_order_value,
    MAX(s.sale_date) as last_purchase_date,
    DATEDIFF(CURRENT_DATE(), MAX(s.sale_date)) as days_since_last_purchase,
    COUNT(DISTINCT p.category) as categories_purchased
  FROM mcp_workshop.default.customers c
  LEFT JOIN mcp_workshop.default.sales s ON c.customer_id = s.customer_id
  LEFT JOIN mcp_workshop.default.products p ON s.product_id = p.product_id
  WHERE c.customer_id = customer_id
  GROUP BY c.customer_id, c.customer_name, c.email, c.region, c.signup_date;`}
              />
            </div>

            <InfoBox type="success" title="Functions Created!">
              <p>Your Unity Catalog functions are now available as MCP tools at:</p>
              <code className="block mt-3 p-3 bg-slate-100 rounded-lg text-slate-800 font-mono text-sm">
                https://&lt;workspace-hostname&gt;/api/2.0/mcp/functions/mcp_workshop/default
              </code>
              <p className="mt-3 text-sm">These functions will automatically appear as available tools when you connect an AI agent to this MCP endpoint.</p>
            </InfoBox>
          </div>
        </WorkshopStep>

        <WorkshopStep number={3} title="Set Up Genie Space for Natural Language Queries">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Genie allows business users to ask natural language questions about their data. When exposed as an MCP tool, 
              AI agents can leverage the same conversational intelligence and business context.
            </p>

            <InfoBox type="warning" title="Manual Setup Required">
              <p>Genie spaces cannot be created programmatically. Follow these steps in your Databricks workspace to create your Genie space.</p>
            </InfoBox>

            <div className="space-y-4">
              <div className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">1</span>
                  <h4 className="text-lg font-bold text-slate-900">Navigate to Genie</h4>
                </div>
                <p className="text-slate-700 ml-11">
                  In your Databricks workspace, go to the sidebar and click on <strong>Genie</strong>.
                </p>
              </div>

              <div className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">2</span>
                  <h4 className="text-lg font-bold text-slate-900">Create New Space</h4>
                </div>
                <p className="text-slate-700 ml-11">
                  Click <strong>"Create Genie space"</strong> and name it <code className="bg-slate-200 px-2 py-1 rounded text-slate-800">MCP Workshop Space</code>.
                </p>
              </div>

              <div className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">3</span>
                  <h4 className="text-lg font-bold text-slate-900">Add Your Tables</h4>
                </div>
                <p className="text-slate-700 ml-11 mb-3">Add these tables to your Genie space:</p>
                <ul className="ml-11 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
                    <code className="bg-slate-200 px-2 py-1 rounded text-slate-800 text-sm">mcp_workshop.default.products</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
                    <code className="bg-slate-200 px-2 py-1 rounded text-slate-800 text-sm">mcp_workshop.default.customers</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
                    <code className="bg-slate-200 px-2 py-1 rounded text-slate-800 text-sm">mcp_workshop.default.sales</code>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">4</span>
                  <h4 className="text-lg font-bold text-slate-900">Configure Instructions</h4>
                </div>
                <p className="text-slate-700 ml-11 mb-3">Add these instructions to help Genie understand your data:</p>
                <div className="ml-11">
                  <CodeBlock
                    language="text"
                    title="Genie Instructions"
                    code={`This dataset contains e-commerce data with three main tables:

1. Products: Contains product information including names, categories, and prices
2. Customers: Contains customer information including regions and signup dates  
3. Sales: Contains transaction data linking customers to products with quantities and revenue

When answering questions:
- Always include relevant context about time periods
- Format monetary values with currency symbols
- Provide insights about trends when showing data
- Suggest follow-up questions when appropriate

Common questions users might ask:
- "What are our top-selling products?"
- "Which region generates the most revenue?"
- "Show me sales trends over time"
- "What's the average order value by customer segment?"`}
                  />
                </div>
              </div>
            </div>

            <InfoBox type="tip" title="Test Your Genie Space">
              <p>Try asking questions like:</p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">💬</span>
                  "What are the top 5 products by revenue?"
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">💬</span>
                  "Which region has the most customers?"
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">💬</span>
                  "Show me sales trends by category"
                </li>
              </ul>
            </InfoBox>

            <div>
              <p className="text-slate-700 mb-4">
                Once your Genie space is created, note the space ID from the URL. You'll use it to access the MCP endpoint:
              </p>
              <CodeBlock
                language="text"
                title="Genie MCP Endpoint"
                code={`https://<workspace-hostname>/api/2.0/mcp/genie/{genie_space_id}`}
              />
            </div>
          </div>
        </WorkshopStep>

        <WorkshopStep number={4} title="Prototype Your Agent in AI Playground">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Now let's test our MCP tools by creating an agent in AI Playground. This gives us a visual way to 
              prototype and test our agent before deploying it.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="text-lg font-bold text-blue-900 mb-3">🎯 Agent Goal</h4>
              <p className="text-blue-800">
                Create a customer service agent that can look up customer information, analyze order history, 
                and answer business questions using natural language.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Set Up AI Playground Agent</h4>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-2">Step 1: Open AI Playground</h5>
                  <p className="text-slate-700 text-sm">
                    Navigate to <strong>AI Playground</strong> in your Databricks workspace and select a model with the <strong>"Tools enabled"</strong> label.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-2">Step 2: Add Unity Catalog Functions</h5>
                  <p className="text-slate-700 text-sm mb-3">
                    Click <strong>Tools → + Add tool</strong> and select <strong>Hosted Function</strong>. Add these functions:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• <code>mcp_workshop.default.get_customer_orders</code></li>
                    <li>• <code>mcp_workshop.default.get_product_performance</code></li>
                    <li>• <code>mcp_workshop.default.get_regional_sales</code></li>
                    <li>• <code>mcp_workshop.default.get_customer_insights</code></li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="font-bold text-slate-900 mb-2">Step 3: Add Genie Space</h5>
                  <p className="text-slate-700 text-sm">
                    Add your Genie space as another tool by entering your Genie space endpoint URL.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Test Your Agent</h4>
              <p className="text-slate-700 mb-4">Try these sample prompts to test your agent's capabilities:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h5 className="font-semibold text-emerald-900 mb-2">Unity Catalog Function Tests</h5>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>💬 "Show me the order history for customer C0001"</li>
                    <li>💬 "What are the best performing Electronics products?"</li>
                    <li>💬 "Give me insights about customer C0025"</li>
                    <li>💬 "How are sales performing in the North region?"</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">Genie Space Tests</h5>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>💬 "What are our top 10 products by revenue?"</li>
                    <li>💬 "Which customers spend the most?"</li>
                    <li>💬 "Show me sales trends by month"</li>
                    <li>💬 "What's our average order value by region?"</li>
                  </ul>
                </div>
              </div>
            </div>

            <InfoBox type="info" title="AI Playground Benefits">
              <p>Using AI Playground for prototyping gives you:</p>
              <ul className="mt-3 space-y-2">
                <li>• <strong>Visual testing environment</strong> - See how your agent behaves in real-time</li>
                <li>• <strong>Tool selection interface</strong> - Easily add/remove tools to test different combinations</li>
                <li>• <strong>Export capability</strong> - Generate Python code for deployment when ready</li>
                <li>• <strong>Iteration speed</strong> - Quickly test different prompts and tool configurations</li>
              </ul>
            </InfoBox>
          </div>
        </WorkshopStep>

        <WorkshopStep number={5} title="Export and Deploy Your Agent">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Once you're satisfied with your agent's behavior in AI Playground, export it for deployment.
            </p>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h5 className="font-bold text-slate-900 mb-2">Step 1: Export from AI Playground</h5>
                <p className="text-slate-700 text-sm">
                  Click <strong>Export</strong> in AI Playground to generate Python notebooks that define and deploy your agent.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h5 className="font-bold text-slate-900 mb-2">Step 2: Review Generated Code</h5>
                <p className="text-slate-700 text-sm">
                  The exported code creates a LangGraph ChatAgent with your selected tools and deploys it using Mosaic AI Agent Framework.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h5 className="font-bold text-slate-900 mb-2">Step 3: Address TODOs</h5>
                <p className="text-slate-700 text-sm">
                  Complete any TODO items in the generated notebooks to customize your agent for production use.
                </p>
              </div>
            </div>

            <InfoBox type="tip" title="Deployment Options">
              <p>Your exported agent can be deployed as:</p>
              <ul className="mt-3 space-y-1">
                <li>• <strong>Model serving endpoint</strong> - For REST API access</li>
                <li>• <strong>Databricks App</strong> - For web interface deployment</li>
                <li>• <strong>Notebook job</strong> - For batch processing workflows</li>
              </ul>
            </InfoBox>
          </div>
        </WorkshopStep>

        {/* Next Steps */}
        <div className="mt-16 p-8 rounded-2xl border-2 border-sky-200 bg-sky-50">
          <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            🎉 Section Complete!
          </h3>
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            You now have a complete customer service agent with access to both structured data queries (Unity Catalog functions) 
            and natural language analytics (Genie space). Your agent can handle complex customer inquiries with enterprise-grade security.
          </p>
          
          <h4 className="text-lg font-bold text-slate-900 mb-4">What You've Accomplished</h4>
          <ul className="space-y-3 text-slate-700 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              Created Unity Catalog functions that automatically become MCP tools
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              Set up Genie space for natural language data queries
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              Prototyped and tested your agent in AI Playground
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              Learned how to export agents for production deployment
            </li>
          </ul>

          <div className="flex flex-wrap gap-4">
            <a
              href="/external-mcp"
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-lg font-bold text-white hover:bg-sky-700 transition-colors shadow-lg"
            >
              Next: External MCP
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              Official Docs
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://docs.databricks.com/aws/en/generative-ai/agent-framework/ai-playground-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              AI Playground Guide
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