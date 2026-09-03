/**
 * webmcp/register.ts
 *
 * Registers Casefile's WebMCP tools in the browser runtime.
 *
 * Attaches to:
 * - document.modelContext
 */

import { WEBMCP_TOOLS, WEBMCP_TOOL_MAP, type WebMCPToolDefinition } from './tools';

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: any) => void;
      getTools: () => Promise<any[]>;
      executeTool: (tool: any, params: string) => Promise<any>;
    };
  }
}

/** Execute a tool directly by name and parameters */
export async function executeWebMCPTool(name: string, params: Record<string, any> = {}) {
  const tool = WEBMCP_TOOL_MAP.get(name);
  if (!tool) {
    throw new Error(`WebMCP Tool '${name}' is not registered in Casefile.`);
  }

  const result = await tool.handler(params);
  return result;
}

/** Registers WebMCP tools on window load or component mount */
export async function registerWebMCP() {
  if (typeof document === 'undefined') {
    return;
  }

  if (!document.modelContext) {
    console.warn("[WebMCP] document.modelContext is unavailable");
    return;
  }

  const registeredTools: string[] = [];

  for (const tool of WEBMCP_TOOLS) {
    try {
      document.modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: async (input: any) => {
          const result = await tool.handler(input);
          
          // Ensure response matches MCP specification (requires a content array)
          return {
            content: [
              {
                type: 'text',
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
              }
            ],
            isError: result && typeof result === 'object' && result.success === false
          };
        }
      });

      registeredTools.push(tool.name);
    } catch (error) {
      console.error(
        `[WebMCP] Failed to register ${tool.name}:`,
        error
      );
    }
  }

  console.log(
    `[WebMCP] Successfully registered ${registeredTools.length}/${WEBMCP_TOOLS.length} tools:`,
    registeredTools
  );

  try {
    const registered = await document.modelContext.getTools();
    console.log(
      "[WebMCP] Native registry:",
      registered.map(tool => tool.name)
    );
  } catch (error) {
    console.error("[WebMCP] Failed to fetch native registry:", error);
  }
}
