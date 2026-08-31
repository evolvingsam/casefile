/**
 * webmcp/register.ts
 *
 * Registers Casefile's WebMCP tools in the browser runtime.
 *
 * Attaches to:
 * - navigator.modelContextProtocol (if supported by standard browser polyfill/extension)
 * - window.webMCP / window.casefileWebMCP (global registry for client & subagents)
 */

import { WEBMCP_TOOLS, WEBMCP_TOOL_MAP, type WebMCPToolDefinition } from './tools';

export interface WebMCPRegistry {
  isRegistered: boolean;
  tools: WebMCPToolDefinition[];
  executeTool: (name: string, params?: Record<string, any>) => Promise<any>;
}

declare global {
  interface Window {
    webMCP?: {
      registerTool?: (tool: any) => void;
      getTools?: () => any[];
      executeTool?: (name: string, params?: any) => Promise<any>;
      [key: string]: any;
    };
    casefileWebMCP?: WebMCPRegistry;
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
export function registerWebMCP(): WebMCPRegistry {
  if (typeof window === 'undefined') {
    return {
      isRegistered: false,
      tools: WEBMCP_TOOLS,
      executeTool: executeWebMCPTool,
    };
  }

  // 1. Create global Casefile registry on window object
  const registry: WebMCPRegistry = {
    isRegistered: true,
    tools: WEBMCP_TOOLS,
    executeTool: executeWebMCPTool,
  };

  window.casefileWebMCP = registry;

  // 2. Register on window.webMCP if WebMCP host / Chrome extension polyfill is active
  if (!window.webMCP) {
    window.webMCP = {};
  }

  window.webMCP.getTools = () =>
    WEBMCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));

  window.webMCP.executeTool = async (name: string, params: any) => {
    return executeWebMCPTool(name, params || {});
  };

  // 3. Register on navigator.modelContextProtocol if present
  const nav = navigator as any;
  if (nav.modelContextProtocol && typeof nav.modelContextProtocol.registerTool === 'function') {
    WEBMCP_TOOLS.forEach((tool) => {
      try {
        nav.modelContextProtocol.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          handler: tool.handler,
        });
      } catch {
        // Safe fallback if already registered
      }
    });
  }

  console.log('[WebMCP] Registered 9 investigation tools for Casefile:', WEBMCP_TOOLS.map((t) => t.name));

  return registry;
}
