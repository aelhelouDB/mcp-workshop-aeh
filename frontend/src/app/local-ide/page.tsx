import WorkshopStep from "@/components/WorkshopStep";
import CodeBlock from "@/components/CodeBlock";
import InfoBox from "@/components/InfoBox";

export default function LocalIdePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-4xl text-white shadow-lg">
              💻
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-2">Local IDE Setup</h1>
              <p className="text-xl text-slate-600">Build agents in your development environment</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Development-First Approach</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              While AI Playground is great for prototyping, serious agent development happens in code. 
              Set up your local environment to build, test, and deploy production-ready MCP-powered agents.
            </p>
          </div>

          <InfoBox type="info" title="What you&apos;ll learn">
            <ul className="space-y-2 mt-3">
              <li>• Setting up local development environment for MCP agents</li>
              <li>• Using the Databricks MCP SDK in your IDE</li>
              <li>• Building agents with LangGraph and OpenAI</li>
              <li>• Testing and debugging agents locally</li>
            </ul>
          </InfoBox>
        </div>

        <WorkshopStep number={1} title="Environment Setup">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Configure your local development environment to work with Databricks MCP servers.
          </p>

          <CodeBlock
            language="bash"
            title="Install Dependencies"
            code={`# Install the Databricks MCP SDK
pip install -U databricks-sdk databricks_mcp

# Install agent frameworks
pip install langgraph openai

# Authenticate to Databricks
databricks auth login --host https://<workspace-hostname>`}
          />
        </WorkshopStep>

        <WorkshopStep number={2} title="Build Local Agent">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Create a complete agent locally that uses your MCP tools.
          </p>

          <CodeBlock
            language="python"
            title="Local Agent"
            code={`from databricks.sdk import WorkspaceClient
from databricks_mcp import DatabricksOAuthClientProvider
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

async def test_mcp_connection():
    client = WorkspaceClient()
    url = "https://<workspace>/api/2.0/mcp/functions/mcp_workshop/default"
    
    async with streamablehttp_client(url, auth=DatabricksOAuthClientProvider(client)) as streams:
        read_stream, write_stream, _ = streams
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            tools = await session.list_tools()
            print(f"Available tools: {[tool.name for tool in tools.tools]}")

await test_mcp_connection()`}
          />
        </WorkshopStep>

        {/* Next Steps */}
        <div className="mt-16 p-8 rounded-2xl border-2 border-purple-200 bg-purple-50">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">🎉 Workshop Complete!</h3>
          <p className="text-lg text-slate-700 mb-6">
            You now have the complete toolkit for building MCP-powered agents with Databricks!
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-lg font-bold text-white hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </a>
            <a
              href="https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp#local-ide-build-an-agent-with-managed-mcp-servers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Official Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
