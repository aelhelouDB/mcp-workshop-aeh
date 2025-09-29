import InfoBox from "../../components/InfoBox";
import Step from "../../components/Step";
import CodeBlock from "../../components/CodeBlock";

export default function ManagedMcpPage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10">
        <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute bottom-[-140px] left-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-2xl">
            🔧
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              Managed MCP • Serverless tools • Unity Catalog ready
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Managed MCP Servers
            </h1>
            <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
              Run production-grade tools instantly with Databricks-managed MCP endpoints. Connect agents to vector search, Unity Catalog functions, and Genie spaces with secure, zero-maintenance infrastructure.
            </p>
            <InfoBox type="info">
              This content is based on the official{" "}
              <a
                href="https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sky-200 underline decoration-sky-500/40 underline-offset-4 hover:text-white"
              >
                Databricks documentation
              </a>
              .
            </InfoBox>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 text-sm leading-relaxed text-slate-200">
          <p>
            Model Context Protocol (MCP) servers act as bridges that let AI agents access external data and tools. Instead of building these connections from scratch, use Databricks managed MCP servers to instantly connect your agents to data stored in Unity Catalog, vector search indexes, and custom functions.
          </p>
          <p>
            These endpoints support the Databricks OAuth handshake, work out of the box with the AI Playground, and expose consistent tool schemas that any MCP-compatible client can consume. Because they are hosted by Databricks, you benefit from automatic scaling, observability, and enterprise security controls.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-white">MCP use cases</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Fast-start AI assistants with secure data access</li>
            <li>• Monitoring dashboards powered by vector search</li>
            <li>• Production agents orchestrating UC functions</li>
            <li>• Genie-backed natural language BI experiences</li>
          </ul>
        </div>
      </section>

      <Step number={1} title="Available Managed Servers">
        <p>
          Databricks provides three types of managed MCP servers that work out of the box. Each server is scoped by Unity Catalog resources and inherits your workspace security policies.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-6 py-4">MCP Server</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">URL pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 font-semibold text-white">Vector search</td>
                <td className="px-6 py-4">
                  Query vector search indexes to find relevant documents and data. Only indexes with Databricks-managed embeddings are supported.
                </td>
                <td className="px-6 py-4 font-mono text-xs text-sky-200">
                  https://&lt;workspace-hostname&gt;/api/2.0/mcp/vector-search/{"{"}catalog{"}"}/{"{"}schema{"}"}
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 font-semibold text-white">Unity Catalog functions</td>
                <td className="px-6 py-4">
                  Run Unity Catalog functions like custom Python or SQL tools to power complex workflows.
                </td>
                <td className="px-6 py-4 font-mono text-xs text-sky-200">
                  https://&lt;workspace-hostname&gt;/api/2.0/mcp/functions/{"{"}catalog{"}"}/{"{"}schema{"}"}
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 font-semibold text-white">Genie space</td>
                <td className="px-6 py-4">
                  Query Genie spaces to get conversational insights from structured tables, notebooks, and dashboards.
                </td>
                <td className="px-6 py-4 font-mono text-xs text-sky-200">
                  https://&lt;workspace-hostname&gt;/api/2.0/mcp/genie/{"{"}genie_space_id{"}"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Step>

      <Step number={2} title="Example Scenario">
        <p>
          Imagine you want to build an agent that helps with customer support. You could connect it to multiple managed MCP servers:
        </p>
        <ul className="space-y-3 text-sm text-slate-200">
          <li>
            <strong className="text-white">Vector search:</strong>{" "}
            <code className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs">
              /api/2.0/mcp/vector-search/prod/customer_support
            </code>
            <p className="ml-6 mt-1 text-xs text-slate-400">
              Searches support tickets and documentation to surface relevant answers.
            </p>
          </li>
          <li>
            <strong className="text-white">Genie space:</strong>{" "}
            <code className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs">
              /api/2.0/mcp/genie/{"{"}billing_space_id{"}"}
            </code>
            <p className="ml-6 mt-1 text-xs text-slate-400">
              Queries billing data and curated insights authored by domain experts.
            </p>
          </li>
          <li>
            <strong className="text-white">UC functions:</strong>{" "}
            <code className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs">
              /api/2.0/mcp/functions/prod/billing
            </code>
            <p className="ml-6 mt-1 text-xs text-slate-400">
              Runs custom SQL or Python logic for account lookups and updates.
            </p>
          </li>
        </ul>
        <InfoBox type="tip">
          This blend gives your agent access to unstructured knowledge (support tickets), curated structured data (Genie), and custom business logic encapsulated in Unity Catalog functions.
        </InfoBox>
      </Step>

      <Step
        number={3}
        title="Example Notebooks: Build an agent with managed MCP servers"
      >
        <p>
          The Databricks documentation provides example notebooks that show how to author LangGraph and OpenAI agents that call MCP tools. Explore these notebooks to see how to configure tool definitions, orchestrate conversations, and manage tool execution in production.
        </p>
        <InfoBox type="info">
          Refer to the{" "}
          <a
            href="https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sky-200 underline decoration-sky-500/40 underline-offset-4 hover:text-white"
          >
            official documentation
          </a>{" "}
          to access the latest notebooks.
        </InfoBox>
      </Step>

      <Step number={4} title="Use Genie to Chat with Your Data">
        <p>
          Genie lets business users ask natural language questions across curated datasets. When exposed as an MCP tool, agents inherit the same conversational intelligence and guardrails.
        </p>
        <InfoBox type="info">
          At this time, Genie spaces cannot be created programmatically. Follow the official documentation to set up a new Genie space using the workshop tables (<code>products</code>, <code>customers</code>, and <code>sales</code>).
        </InfoBox>
        <p>
          Once created, your Genie space will have a URL that you can use as an MCP tool:
        </p>
        <CodeBlock
          language="text"
          value="https://<workspace-hostname>/api/2.0/mcp/genie/{genie_space_id}"
        />
      </Step>

      <Step number={5} title="Create a Custom UC Function Tool">
        <p>
          You can also expose your own custom Python or SQL functions from Unity Catalog as tools for your agent. Let’s create a function to get the order history for a specific customer.
        </p>
        <p>Run the following SQL in a Databricks notebook to create the function:</p>
        <CodeBlock
          language="sql"
          value={`CREATE OR REPLACE FUNCTION mcp_workshop.default.get_customer_orders(customer_id STRING)
RETURNS TABLE
RETURN
  SELECT
    s.sale_id,
    s.sale_date,
    p.product_name,
    s.quantity,
    s.revenue
  FROM
    mcp_workshop.default.sales s
  JOIN
    mcp_workshop.default.products p
  ON
    s.product_id = p.product_id
  WHERE
    s.customer_id = customer_id
  ORDER BY
    s.sale_date DESC;`}
        />
        <InfoBox type="tip">
          Once this function is created in Unity Catalog, it is automatically exposed through the managed MCP endpoint for functions. Agents can call this tool to retrieve a customer{`'s`} order history without additional backend services.
        </InfoBox>
      </Step>
    </div>
  );
}
