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
  'generate_random',
  {
    title: 'Generate Random Numbers',
    description: 'Tool to generate random numbers',
    inputSchema: {
      numRandoms: z.number().int().describe("The number of random numbers to generate"),
      type: z.enum(['integer', 'decimal']).describe("The type of random numbers to generate"),
      scale: z.number().describe("The scale/maximum value for the numbers (e.g. 1, 10, 100, etc.)"),
    },
  },
  async ({ numRandoms, type, scale }) => {
    const numbers = [];
    for (let i = 0; i < numRandoms; i++) {
      let val = Math.random() * scale;
      if (type === 'integer') {
        val = Math.floor(val);
      }
      numbers.push(val);
    }
    return {
      content: [{type: "text", text: JSON.stringify(numbers)}]
    };
  }
);


export default class MpcController extends nails.Controller {
  json = true;
  routes = [
    ['post', '/mcp'],
    ['get', '/mcp', {action: 'unsupportedMcpAction'}],
    ['delete', '/mcp', {action: 'unsupportedMcpAction'}],
    ['post', '/invoke/generate_random'],
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


  async generate_random(params, request, response) {
    const inputData = request.body;
    return await server.invokeTool('generate_random', inputData);
  }
}

function generateMcpToolExecutionResults() {
    return {}; // Example results for MCP Tool execution
}