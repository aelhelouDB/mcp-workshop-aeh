import CodeBlock from "../../components/CodeBlock";
import InfoBox from "../../components/InfoBox";
import Step from "../../components/Step";

export default function ExternalMcpPage() {
  const sdkCode = `%pip install -U databricks-sdk databricks_mcp tabulate databricks_ai_bridge
%restart_python

import json
from databricks.sdk import WorkspaceClient
from databricks_mcp import DatabricksOAuthClientProvider
from databricks.sdk.credentials_provider import ModelServingUserCredentials
from mcp.client.streamable_http import streamablehttp_client as connect
from mcp import ClientSession
from tabulate import tabulate


async def main():
    app_url = "https://<workspace-hostname>/api/2.0/mcp/external/github_u2m_connection"
    client = WorkspaceClient()

    async with connect(app_url, auth=DatabricksOAuthClientProvider(client)) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            init = await session.initialize()
            print(json.dumps(init.model_dump(), indent=2))
            tools = await session.list_tools()
            print(json.dumps(tools.model_dump(), indent=2))

            arguments = {
                "owner": "mlflow",
                "repo": "mlflow",
                "sha": "master"
            }
            response = await session.call_tool(name="list_commits", arguments=arguments)

            data = json.loads(response.content[0].text)
            rows = []
            for commit in data:
                author = commit.get("commit", {}).get("author", {}).get("name")
                message = commit.get("commit", {}).get("message", "").split("\n")[0]
                html_url = commit.get("html_url", "")
                rows.append([author, message, html_url])

            # Print as table
            print(tabulate(rows, headers=["Author", "Message", "Commit URL"], tablefmt="github"))

await main()`;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10">
        <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-[-120px] h-56 w-56 rounded-full bg-sky-500/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-2xl">
            🌐
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              External MCP • OAuth • Unity Catalog proxy
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Use External MCP Servers
            </h1>
            <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
              Connect Databricks agents to third-party MCP servers through secure Unity Catalog HTTP connections. Bring in SaaS tools, partner systems, and custom APIs without sacrificing governance.
            </p>
            <InfoBox type="info">
              This content is based on the official{" "}
              <a
                href="https://docs.databricks.com/aws/en/generative-ai/mcp/external-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-200 underline decoration-emerald-500/40 underline-offset-4 hover:text-white"
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
            External MCP servers unlock vendor APIs, custom services, and private infrastructure without exposing raw credentials to end users. Databricks provisions a managed proxy for each Unity Catalog HTTP connection so your agents authenticate with OAuth and inherit access policies automatically.
          </p>
          <p>
            You can attach these external tools to Agents, the AI Playground, or local SDK-based workflows. The connection metadata stays in Unity Catalog, giving platform teams centralized governance and auditing.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-white">Why the proxy matters</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Keeps tokens and secrets inside Unity Catalog</li>
            <li>• Handles OAuth refresh flows automatically</li>
            <li>• Provides consistent auditing for third-party tool calls</li>
            <li>• Allows zero-trust enforcement across external services</li>
          </ul>
        </div>
      </section>

      <Step number={1} title="Create a Unity Catalog HTTP Connection">
        <p>
          Start by creating an HTTP connection scoped to your catalog and schema. This stores authentication details securely and provisions a managed proxy endpoint.
        </p>
        <InfoBox type="warning">
          When creating the HTTP connection, ensure you select the <strong>Is MCP connection</strong> checkbox and that the URL points to a valid MCP server endpoint.
        </InfoBox>
        <p>
          After the connection is created, Databricks automatically provisions a proxy endpoint that securely forwards traffic to the external server. The proxy URL follows this format:
        </p>
        <CodeBlock
          language="text"
          value="https://<workspace-hostname>/api/2.0/mcp/external/{connection_name}"
        />
      </Step>

      <Step number={2} title="Connect with AI Playground">
        <p>
          You can test external MCP servers directly inside the AI Playground without writing code:
        </p>
        <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-200">
          <li>
            Open the <strong>AI Playground</strong> in your Databricks workspace.
          </li>
          <li>Select a model with the <strong>Tools enabled</strong> label.</li>
          <li>
            Click <strong>Tools &gt; + Add tool</strong> and choose{" "}
            <strong>MCP Servers</strong>.
          </li>
          <li>
            Under <strong>External MCP servers</strong>, choose the Unity
            Catalog HTTP connection you created.
          </li>
          <li>
            Start chatting with the LLM to test its interaction with your
            external tools.
          </li>
        </ol>
      </Step>

      <Step number={3} title="Use the open source MCP SDK">
        <p>
          With the connection{`'s`} proxy endpoint URL, you can connect to an
          external MCP server using the open-source Python SDK. The example
          below shows how to use a connection named{" "}
          <code>github_u2m_connection</code> to connect to a GitHub MCP server
          and list recent commits from the <code>mlflow/mlflow</code>{" "}
          repository.
        </p>
        <CodeBlock language="python" value={sdkCode} />
      </Step>
    </div>
  );
}
