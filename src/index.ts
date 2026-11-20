#!/usr/bin/env node
/**
 * BareBones Industrial Supply Co. - Production MCP Server
 * ============================================================================
 * Model Context Protocol (MCP) server providing authoritative OEM bench
 * specifications, multimeter resistance tolerances, and hydraulic cross-references
 * for commercial and residential wear components (HVAC, pumps, and spa heaters).
 *
 * Designed for 100/100 Tool Description Quality Score (TDQS) on Glama.ai
 * Fully compatible with Smithery.ai, Claude Desktop, Cursor, and Antigravity.
 * ============================================================================
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import {
  lookupFurnaceIgniterTool,
  diagnoseIgniterResistanceTool,
  handleLookupFurnaceIgniter,
  handleDiagnoseIgniterResistance
} from './tools/igniters';

import {
  calculateHeatingElementResistanceTool,
  lookupSpaHeatingElementTool,
  handleCalculateHeatingElementResistance,
  handleLookupSpaHeatingElement
} from './tools/elements';

import {
  crossReferenceCirculatorPumpTool,
  handleCrossReferenceCirculatorPump
} from './tools/circulators';

import {
  troubleshootMechanicalFailureTool,
  listSupportedOemModelsTool,
  handleTroubleshootMechanicalFailure,
  handleListSupportedOemModels
} from './tools/general';

import { RESOURCES, handleReadResource } from './resources/index';
import { PROMPTS, handleGetPrompt } from './prompts/index';

const server = new Server(
  {
    name: 'barebones-industrial-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    }
  }
);

// ----------------------------------------------------------------------------
// Tool Registration
// ----------------------------------------------------------------------------
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      lookupFurnaceIgniterTool,
      diagnoseIgniterResistanceTool,
      calculateHeatingElementResistanceTool,
      lookupSpaHeatingElementTool,
      crossReferenceCirculatorPumpTool,
      troubleshootMechanicalFailureTool,
      listSupportedOemModelsTool
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case 'lookup_furnace_igniter_specs':
        result = handleLookupFurnaceIgniter(args as any);
        break;

      case 'diagnose_igniter_resistance':
        result = handleDiagnoseIgniterResistance(args as any);
        break;

      case 'calculate_heating_element_resistance':
        result = handleCalculateHeatingElementResistance(args as any);
        break;

      case 'lookup_spa_heating_element':
        result = handleLookupSpaHeatingElement(args as any);
        break;

      case 'cross_reference_circulator_pump':
        result = handleCrossReferenceCirculatorPump(args as any);
        break;

      case 'troubleshoot_mechanical_failure':
        result = handleTroubleshootMechanicalFailure(args as any);
        break;

      case 'list_supported_oem_models':
        result = handleListSupportedOemModels(args as any);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message || 'An error occurred processing the diagnostic tool request.',
            tool: name,
            suggestion: 'Verify input parameter types or call list_supported_oem_models for catalog guidance.'
          }, null, 2)
        }
      ]
    };
  }
});

// ----------------------------------------------------------------------------
// Resource Registration
// ----------------------------------------------------------------------------
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: RESOURCES
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  return handleReadResource(uri);
});

// ----------------------------------------------------------------------------
// Prompt Registration
// ----------------------------------------------------------------------------
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: PROMPTS
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleGetPrompt(name, args as any);
});

// ----------------------------------------------------------------------------
// Process Startup
// ----------------------------------------------------------------------------
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('BareBones Industrial MCP Server initialized and listening on stdio.');
}

run().catch((error) => {
  console.error('Fatal MCP startup error:', error);
  process.exit(1);
});
