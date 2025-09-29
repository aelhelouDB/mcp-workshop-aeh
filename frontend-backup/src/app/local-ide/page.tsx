import CodeBlock from "../../components/CodeBlock";
import InfoBox from "../../components/InfoBox";
import Step from "../../components/Step";

export default function LocalIdePage() {
  const setupEnvCode = `pip install -U "mcp>=1.9" "databricks-sdk[openai]" "mlflow>=3.1.0" "databricks-agents>=1.0.0" "databricks-mcp"`;

  const testConnectionCode = `from databricks_mcp import DatabricksMCPClient
from databricks.sdk import WorkspaceClient

# TODO: Update to the Databricks CLI profile name you specified when
# configuring authentication to the workspace.
databricks_cli_profile = "YOUR_DATABRICKS_CLI_PROFILE"
assert (
    databricks_cli_profile != "YOUR_DATABRICKS_CLI_PROFILE"
), "Set databricks_cli_profile to the Databricks CLI profile name you specified when configuring authentication to the workspace"
workspace_client = WorkspaceClient(profile=databricks_cli_profile)
workspace_hostname = workspace_client.config.host
mcp_server_url = f"{workspace_hostname}/api/2.0/mcp/functions/system/ai"

# This code uses the Unity Catalog functions MCP server to expose built-in
# AI tools under \`system.ai\`, like the \`system.ai.python_exec\` code interpreter tool
def test_connect_to_server():
    mcp_client = DatabricksMCPClient(server_url=mcp_server_url, workspace_client=workspace_client)
    tools = mcp_client.list_tools()

    print(
        f"Discovered tools {[t.name for t in tools]} "
        f"from MCP server {mcp_server_url}"
    )

    result = mcp_client.call_tool(
        "system__ai__python_exec", {"code": "print('Hello, world!')"}
    )
    print(
        f"Called system__ai__python_exec tool and got result "
        f"{result.content}"
    )


if __name__ == "__main__":
    test_connect_to_server()`;

  const createAgentCode = `import json
import uuid
import asyncio
from typing import Any, Callable, List
from pydantic import BaseModel
import mlflow
from mlflow.pyfunc import ResponsesAgent
from mlflow.types.responses import ResponsesAgentRequest, ResponsesAgentResponse
from databricks_mcp import DatabricksMCPClient
from databricks.sdk import WorkspaceClient

# 1) CONFIGURE YOUR ENDPOINTS/PROFILE
LLM_ENDPOINT_NAME = "databricks-claude-3-7-sonnet"
SYSTEM_PROMPT = "You are a helpful assistant."
DATABRICKS_CLI_PROFILE = "YOUR_DATABRICKS_CLI_PROFILE"
assert (
    DATABRICKS_CLI_PROFILE != "YOUR_DATABRICKS_CLI_PROFILE"
), "Set DATABRICKS_CLI_PROFILE to the Databricks CLI profile name you specified when configuring authentication to the workspace"
workspace_client = WorkspaceClient(profile=DATABRICKS_CLI_PROFILE)
host = workspace_client.config.host

# Add more MCP server URLs here if desired
MANAGED_MCP_SERVER_URLS = [
    f"{host}/api/2.0/mcp/functions/system/ai",
]
# Add Custom MCP Servers hosted on Databricks Apps
CUSTOM_MCP_SERVER_URLS = []

# ... rest of the agent code from documentation ...
`;

  const deployAgentCode = `import os
from databricks.sdk import WorkspaceClient
from databricks import agents
import mlflow
from mlflow.models.resources import DatabricksFunction, DatabricksServingEndpoint, DatabricksVectorSearchIndex
from mcp_agent import LLM_ENDPOINT_NAME
from databricks_mcp import DatabricksMCPClient

# TODO: Update this to your Databricks CLI profile name
databricks_cli_profile = "YOUR_DATABRICKS_CLI_PROFILE"
assert (
    databricks_cli_profile != "YOUR_DATABRICKS_CLI_PROFILE"
), "Set databricks_cli_profile to the Databricks CLI profile name you specified when configuring authentication to the workspace"
workspace_client = WorkspaceClient(profile=databricks_cli_profile)


# Configure MLflow and the Databricks SDK to use your Databricks CLI profile
current_user = workspace_client.current_user.me().user_name
mlflow.set_tracking_uri(f"databricks://{databricks_cli_profile}")
mlflow.set_registry_uri(f"databricks-uc://{databricks_cli_profile}")
mlflow.set_experiment(f"/Users/{current_user}/databricks_docs_example_mcp_agent")
os.environ["DATABRICKS_CONFIG_PROFILE"] = databricks_cli_profile

MANAGED_MCP_SERVER_URLS = [
    f"{host}/api/2.0/mcp/functions/system/ai",
]
# Log the agent defined in mcp_agent.py
here = os.path.dirname(os.path.abspath(__file__))
agent_script = os.path.join(here, "mcp_agent.py")
resources = [
    DatabricksServingEndpoint(endpoint_name=LLM_ENDPOINT_NAME),
    DatabricksFunction("system.ai.python_exec"),
    # --- Uncomment and edit the following lines to include custom mcp servers hosted on Databricks Apps ---
    # DatabricksApp(app_name="app-name")
]

for mcp_server_url in MANAGED_MCP_SERVER_URLS:
    mcp_client = DatabricksMCPClient(server_url=mcp_server_url, workspace_client=workspace_client)
    resources.extend(mcp_client.get_databricks_resources())

with mlflow.start_run():
    logged_model_info = mlflow.pyfunc.log_model(
        artifact_path="mcp_agent",
        python_model=agent_script,
        resources=resources,
    )

# TODO Specify your UC model name here
UC_MODEL_NAME = "main.default.databricks_docs_mcp_agent"
registered_model = mlflow.register_model(logged_model_info.model_uri, UC_MODEL_NAME)

agents.deploy(
    model_name=UC_MODEL_NAME,
    model_version=registered_model.version,
)
`;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10">
        <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-[-140px] left-12 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-2xl">
            💻
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              Local dev • OAuth • MCP-aware toolchains
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Local IDE: Build an agent with managed MCP servers
            </h1>
            <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
              Use the Databricks SDK and MCP Python libraries to develop, test, and deploy agents from your local machine. Authenticate with OAuth, call managed tools, and ship production agents without leaving your IDE.
            </p>
            <InfoBox type="info">
              This content is based on the official{" "}
              <a
                href="https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp#local-ide-build-an-agent-with-managed-mcp-servers"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-indigo-200 underline decoration-indigo-500/40 underline-offset-4 hover:text-white"
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
            Building locally lets you iterate quickly while keeping production deployment in lockstep with Databricks security. The MCP Python client handles token refresh, tool discovery, and tool invocation so you can focus on business logic.
          </p>
          <p>
            Combine managed MCP tools with custom Databricks Apps or third-party servers to create rich agents that reason across structured data, vector search, and custom actions.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-white">Local setup checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Python 3.12+ and virtual environment</li>
            <li>• Databricks CLI authenticated via OAuth</li>
            <li>• Access to serverless compute for tool execution</li>
            <li>• Workspace configured with managed MCP servers</li>
          </ul>
        </div>
      </section>

      <Step number={1} title="Set up your environment">
        <p>
          Start by authenticating with OAuth and installing the SDKs you need to interact with managed MCP servers.
        </p>
        <CodeBlock
          language="bash"
          value={`databricks auth login --host https://<your-workspace-hostname>`}
        />
        <CodeBlock language="bash" value={setupEnvCode} />
      </Step>

      <Step number={2} title="Test your local environment connection">
        <p>
          Validate that you can reach the managed Unity Catalog functions MCP server and execute tools from your machine.
        </p>
        <InfoBox type="warning">
          Serverless compute must be enabled in your workspace to run this snippet.
        </InfoBox>
        <CodeBlock language="python" value={testConnectionCode} />
      </Step>

      <Step number={3} title="Create your agent">
        <p>
          Use the MCP SDK to orchestrate tool calls inside a local agent. Save the code below as <code>mcp_agent.py</code> and expand it with your business logic.
        </p>
        <InfoBox type="tip">
          The snippet is truncated for brevity. Refer to the documentation for the full example, including async orchestration and streaming responses.
        </InfoBox>
        <CodeBlock language="python" value={createAgentCode} />
      </Step>

      <Step number={4} title="Deploy your agent">
        <p>
          Package your agent with MLflow and deploy it to Databricks Agents. Register the model in Unity Catalog and inherit resources from managed MCP servers.
        </p>
        <InfoBox type="info">
          Logging your MCP resources ensures Agents can resolve the tools at runtime. Use <code>DatabricksMCPClient().get_databricks_resources()</code> to discover the required dependencies.
        </InfoBox>
        <CodeBlock language="python" value={deployAgentCode} />
      </Step>
    </div>
  );
}
