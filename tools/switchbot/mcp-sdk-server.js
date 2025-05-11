// SwitchBot MCP server implementation - using official MCP SDK
const { execSync } = require('child_process');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

// SwitchBot CLI path - adjust this path as needed
const SWITCHBOT_CLI_PATH = 'C:\\Users\\lksvs\\AppData\\Roaming\\npm\\node_modules\\homebridge-switchbot-ble\\bot-cmd.mjs';

/**
 * Execute SwitchBot command
 *
 * @param {string} command - Command to execute
 * @param {string[]} args - Arguments for the command
 * @returns {Promise<{success: boolean, output: string, error?: string}>} Execution result
 */
async function runSwitchBotCommand(command, args = []) {
    try {
        // Build full command
        const fullCommand = `node "${SWITCHBOT_CLI_PATH}" ${command} ${args.join(' ')}`;
        console.error(`Executing SwitchBot command: ${fullCommand}`);

        // Execute command and get result
        const result = execSync(fullCommand, {
            encoding: 'utf8'
        });

        return {
            success: true,
            output: result.trim()
        };
    } catch (error) {
        console.error(`Failed to execute SwitchBot command: ${error.message}`);
        return {
            success: false,
            error: error.message,
            output: error.stdout ? error.stdout.toString() : ''
        };
    }
}

// Create MCP server
const server = new McpServer({
    name: "switchbot",
    version: "1.1.0",
    description: "SwitchBot device control tool",
    protocolVersion: "2025-03-26" // Use the latest MCP protocol version
});

// === Tool Definitions ===

// Scan tool
server.tool(
    "scan",
    {},
    async () => {
        const result = await runSwitchBotCommand('scan');
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Scan for nearby SwitchBot devices",
        annotations: {
            readOnly: true, // This tool only reads, does not modify
            destructive: false
        }
    }
);

// Status query tool
server.tool(
    "status",
    {
        deviceId: z.string().optional().describe("Device ID (MAC address)")
    },
    async ({ deviceId }) => {
        const result = await runSwitchBotCommand('status', deviceId ? [deviceId] : []);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Get the status of the specified device",
        annotations: {
            readOnly: true,
            destructive: false
        }
    }
);

// Press button tool
server.tool(
    "press",
    {
        deviceId: z.string().describe("Device ID (MAC address)")
    },
    async ({ deviceId }) => {
        const result = await runSwitchBotCommand('press', deviceId ? [deviceId] : []);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Press SwitchBot button device",
        annotations: {
            readOnly: false,
            destructive: false
        }
    }
);

// Turn on device tool
server.tool(
    "on",
    {
        deviceId: z.string().describe("Device ID (MAC address)")
    },
    async ({ deviceId }) => {
        const result = await runSwitchBotCommand('on', deviceId ? [deviceId] : []);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Turn on SwitchBot device",
        annotations: {
            readOnly: false,
            destructive: false
        }
    }
);

// Turn off device tool
server.tool(
    "off",
    {
        deviceId: z.string().describe("Device ID (MAC address)")
    },
    async ({ deviceId }) => {
        const result = await runSwitchBotCommand('off', deviceId ? [deviceId] : []);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Turn off SwitchBot device",
        annotations: {
            readOnly: false,
            destructive: false
        }
    }
);

// Auto-on tool
server.tool(
    "auto-on",
    {},
    async () => {
        const result = await runSwitchBotCommand('auto-on');
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Automatically turn on all scanned devices",
        annotations: {
            readOnly: false,
            destructive: false
        }
    }
);

// Auto-off tool
server.tool(
    "auto-off",
    {},
    async () => {
        const result = await runSwitchBotCommand('auto-off');
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Automatically turn off all scanned devices",
        annotations: {
            readOnly: false,
            destructive: false
        }
    }
);

// Server status tool
server.tool(
    "server",
    {},
    async () => {
        const result = await runSwitchBotCommand('server');
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Get SwitchBot server status",
        annotations: {
            readOnly: true,
            destructive: false
        }
    }
);

// Normalize MAC address tool
server.tool(
    "normalize",
    {
        macAddress: z.string().describe("MAC address")
    },
    async ({ macAddress }) => {
        const result = await runSwitchBotCommand('normalize', [macAddress]);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Normalize MAC address format",
        annotations: {
            readOnly: true,
            destructive: false
        }
    }
);

// Find device tool
server.tool(
    "find",
    {
        macAddress: z.string().describe("MAC address")
    },
    async ({ macAddress }) => {
        const result = await runSwitchBotCommand('find', [macAddress]);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Find device by MAC address",
        annotations: {
            readOnly: true,
            destructive: false
        }
    }
);

// General run tool
server.tool(
    "run",
    {
        command: z.enum(["scan", "status", "press", "on", "off", "auto-on", "auto-off", "server", "normalize", "find"]).describe("SwitchBot command"),
        deviceId: z.string().optional().describe("Device ID (MAC address)")
    },
    async ({ command, deviceId }) => {
        const result = await runSwitchBotCommand(command, deviceId ? [deviceId] : []);
        return {
            content: [{
                type: "text",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    },
    {
        description: "Execute SwitchBot command",
        annotations: {
            readOnly: false, // May modify state depending on command
            destructive: false
        }
    }
);

// === Resource Definitions ===

// Add help resource
server.resource(
    "help",
    "help://switchbot",
    async () => ({
        contents: [{
            uri: "help://switchbot",
            text: `
# SwitchBot MCP Tool Usage Guide

## Available Tools:

1. scan - Scan for nearby SwitchBot devices
2. status [deviceId] - Get device status
3. press [deviceId] - Press device
4. on [deviceId] - Turn on device
5. off [deviceId] - Turn off device
6. auto-on - Automatically turn on all scanned devices
7. auto-off - Automatically turn off all scanned devices
8. server - Get server status
9. normalize {macAddress} - Normalize MAC address format
10. find {macAddress} - Find device by MAC address
11. run {command} [deviceId] - General execute command

## Usage Examples:

- Scan devices: scan
- Press a specific device: press aa:bb:cc:dd:ee:ff
- Turn on device: on aa:bb:cc:dd:ee:ff
- Turn off device: off aa:bb:cc:dd:ee:ff
- Get device status: status aa:bb:cc:dd:ee:ff
- Normalize MAC address: normalize 11:22:33:44:55:66
- Find device: find 11:22:33:44:55:66

## Notes:

- Make sure the device is powered on and within Bluetooth range
- If you encounter connection issues, try scanning devices again
- All MAC addresses are case-insensitive and will be automatically normalized
`
        }]
    })
);

// Add devices resource, get device list
server.resource(
    "devices",
    "devices://list",
    async () => {
        const result = await runSwitchBotCommand('scan');
        return {
            contents: [{
                uri: "devices://list",
                text: result.success ? result.output : `Error: ${result.error}`
            }]
        };
    }
);

/**
 * Start server
 */
async function startServer() {
    console.error('Starting SwitchBot MCP server...');
    const transport = new StdioServerTransport();

    transport.onclose = () => {
        console.error('MCP transport connection closed');
        process.exit(0);
    };

    try {
        await server.connect(transport);
        console.error('SwitchBot MCP server started and waiting for connection');
    } catch (err) {
        console.error(`Failed to start MCP server: ${err.message}`);
        process.exit(1);
    }
}

// Handle process exit signals
process.on('SIGINT', () => {
    console.error('Received SIGINT signal, shutting down server');
    server.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.error('Received SIGTERM signal, shutting down server');
    server.close();
    process.exit(0);
});

// Start server
startServer().catch(err => {
    console.error(`Server failed to start: ${err.message}`);
    process.exit(1);
}); 