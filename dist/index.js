#!/usr/bin/env node
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const igniters_1 = require("./tools/igniters");
const elements_1 = require("./tools/elements");
const circulators_1 = require("./tools/circulators");
const general_1 = require("./tools/general");
const index_1 = require("./resources/index");
const index_2 = require("./prompts/index");
const server = new index_js_1.Server({
    name: 'barebones-industrial-mcp',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {},
        resources: {},
        prompts: {}
    }
});
// ----------------------------------------------------------------------------
// Tool Registration
// ----------------------------------------------------------------------------
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            igniters_1.lookupFurnaceIgniterTool,
            igniters_1.diagnoseIgniterResistanceTool,
            elements_1.calculateHeatingElementResistanceTool,
            elements_1.lookupSpaHeatingElementTool,
            circulators_1.crossReferenceCirculatorPumpTool,
            general_1.troubleshootMechanicalFailureTool,
            general_1.listSupportedOemModelsTool
        ]
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            case 'lookup_furnace_igniter_specs':
                result = (0, igniters_1.handleLookupFurnaceIgniter)(args);
                break;
            case 'diagnose_igniter_resistance':
                result = (0, igniters_1.handleDiagnoseIgniterResistance)(args);
                break;
            case 'calculate_heating_element_resistance':
                result = (0, elements_1.handleCalculateHeatingElementResistance)(args);
                break;
            case 'lookup_spa_heating_element':
                result = (0, elements_1.handleLookupSpaHeatingElement)(args);
                break;
            case 'cross_reference_circulator_pump':
                result = (0, circulators_1.handleCrossReferenceCirculatorPump)(args);
                break;
            case 'troubleshoot_mechanical_failure':
                result = (0, general_1.handleTroubleshootMechanicalFailure)(args);
                break;
            case 'list_supported_oem_models':
                result = (0, general_1.handleListSupportedOemModels)(args);
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
    }
    catch (error) {
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
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    return {
        resources: index_1.RESOURCES
    };
});
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    return (0, index_1.handleReadResource)(uri);
});
// ----------------------------------------------------------------------------
// Prompt Registration
// ----------------------------------------------------------------------------
server.setRequestHandler(types_js_1.ListPromptsRequestSchema, async () => {
    return {
        prompts: index_2.PROMPTS
    };
});
server.setRequestHandler(types_js_1.GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return (0, index_2.handleGetPrompt)(name, args);
});
// ----------------------------------------------------------------------------
// Process Startup
// ----------------------------------------------------------------------------
async function run() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('BareBones Industrial MCP Server initialized and listening on stdio.');
}
run().catch((error) => {
    console.error('Fatal MCP startup error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map