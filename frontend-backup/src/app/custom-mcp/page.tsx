import CodeBlock from "../../components/CodeBlock";
import InfoBox from "../../components/InfoBox";
import Step from "../../components/Step";

export default function CustomMcpPage() {
  const appYamlCode = `command: [
    'uv',
    'run',
    'your-server-name',
    ..., # optionally include additional parameters here
]`;

  const deployCode = `DATABRICKS_USERNAME=$(databricks current-user me | jq -r .userName)
databricks sync . "/Users/$DATABRICKS_USERNAME/mcp-my-custom-server"
databricks apps deploy mcp-my-custom-server --source-code-path "/Workspace/Users/$DATABRICKS_USERNAME/mcp-my-custom-server"`;

  const connectCode = `from databricks_mcp import DatabricksOAuthClientProvider
from databricks.sdk import WorkspaceClient
from mcp.client.session import ClientSession
from mcp.client.streamable_http import streamablehttp_client

databricks_cli_profile = "DEFAULT"
workspace_client = WorkspaceClient(profile=databricks_cli_profile)

# Replace with your actual custom MCP server URL
mcp_server_url = "https://<workspace-hostname>/serving-endpoints/mcp-my-custom-server/invocations"

async def test_connection_to_server():
   async with streamablehttp_client(
      f"{mcp_server_url}", auth=DatabricksOAuthClientProvider(workspace_client)
   ) as (read_stream, write_stream, _), ClientSession(
      read_stream, write_stream
   ) as session:
      # List available tools
      tools = await session.list_tools()
      print(f"Available tools: {[tool.name for tool in tools.tools]}")`;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10">
        <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute bottom-[-140px] right-16 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-2xl">
            🛠️
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              Databricks Apps • Custom MCP • Observability built-in
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Host Custom MCP Servers Using Databricks Apps
            </h1>
            <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
              Package your own tools as MCP servers, deploy them as Databricks Apps, and expose enterprise-ready endpoints with minimal boilerplate. Ideal for proprietary workflows and partner integrations.
            </p>
            <InfoBox type="info">
              This content is based on the official{" "}
              <a
                href="https://docs.databricks.com/aws/en/generative-ai/mcp/custom-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-fuchsia-200 underline decoration-fuchsia-500/40 underline-offset-4 hover:text-white"
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
            Custom MCP servers let you define bespoke tools or wrap existing services so that any MCP-compatible agent can consume them. Databricks Apps provide a secure, autoscaling runtime with first-class observability, logs, and deployment automation.
          </p>
          <p>
            You can deploy Python, Node, or container workloads. Each app exposes a serving endpoint that adheres to the MCP protocol, allowing agents to call your tools alongside managed or external MCP servers.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-white">Why build custom MCP?</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Encapsulate proprietary business logic</li>
            <li>• Bridge legacy systems into conversational flows</li>
            <li>• Deliver partner APIs with Databricks security</li>
            <li>• Maintain observability and deployment controls</li>
          </ul>
        </div>
      </section>

      <Step number={1} title="Set up the MCP server for deployment">
        <p>
          Prepare your repository with dependencies and an app manifest so Databricks knows how to run your server.
        </p>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>1. Add a <code>requirements.txt</code> to your server{`'s`} root directory to specify dependencies.</li>
          <li>2. Add an <code>app.yaml</code> specifying the CLI command Databricks Apps should execute. Apps listen on port 8000 by default.</li>
        </ul>
        <CodeBlock language="yaml" value={appYamlCode} />
      </Step>

      <Step number={2} title="Upload and deploy the Databricks App">
        <p>
          Use the Databricks CLI to create, sync, and deploy your app. The commands below push your source code and trigger a deployment.
        </p>
        <CodeBlock
          language="bash"
          value="databricks apps create mcp-my-custom-server"
        />
        <CodeBlock language="bash" value={deployCode} />
      </Step>

      <Step number={3} title="Connect to the custom MCP server">
        <p>
          Once deployed, you can connect to your custom MCP server from a local environment or a Databricks notebook. The snippet below uses the Databricks SDK to list available tools.
        </p>
        <InfoBox type="tip">
          The documentation includes variations using service principals, on-behalf-of authentication, and workspace notebooks.
        </InfoBox>
        <CodeBlock language="python" value={connectCode} />
      </Step>
    </div>
  );
}
