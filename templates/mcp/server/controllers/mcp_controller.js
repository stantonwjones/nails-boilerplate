import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import nails from "@projectinvicta/nails";

const server = new McpServer({
  name: "Resonance MPC Server",
  version: "1.0.0"
});

// TODO: may want to use registerResource instead
// https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#resources
server.registerTool(
  'query_google_news',
  {
    title: 'Query Google News',
    description: 'Tool to retrieve the last 7 days of news articles for a given topic',
    inputSchema: {
      topic: z.string().describe("The topic to search for"),
    },
  },
  async ({ topic }) => {
    // For now, return a simple static response
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newsFound = await generateMcpToolExecutionResults(topic, 7);
    console.log("FOUND NEWS");
    return {
      content: [{type: "text", text: JSON.stringify(newsFound)}]
    };
  }
);


export default class MpcController extends nails.Controller {
  json = true;
  routes = [
    ['post', '/mcp'],
    ['get', '/mcp', {action: 'unsupportedMcpAction'}],
    ['delete', '/mcp', {action: 'unsupportedMcpAction'}],
    ['post', '/invoke/query_google_news'],
  ];

  async mcp(params, req, res) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    // res.flushHeaders();
    console.log("request handled");
    console.log("Got here");
    // res.end();
  }

  async unsupportedMcpAction(params, req, res) {
    console.log(`Received ${req.method} MCP request`);
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
  }


  async query_google_news(params, request, response) {
    const inputData = request.body;
    return await server.invokeTool('query_google_news', inputData);
  }
}

function generateMcpToolExecutionResults() {
    return {}; // Example results for MCP Tool execution
}