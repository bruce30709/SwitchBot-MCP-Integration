# SwitchBot MCP Integration (SDK Version)

This project provides SwitchBot control integration based on the official Model Context Protocol (MCP) SDK, allowing you to control SwitchBot devices directly via MCP tools in Cursor.

## Features
- Scan for nearby SwitchBot devices
- Query device status
- Press SwitchBot Bot (simulate button)
- Turn devices on/off
- Batch auto on/off all devices
- Normalize and find devices by MAC address
- Query server status  
![image](https://github.com/user-attachments/assets/8473ed23-8637-4af1-b238-94898e1f240b)

## Installation & Setup

### 1. Prerequisites
- **Node.js** 16 or above
- **SwitchBot BLE package** (global install)
- **Official MCP SDK and zod** (project dependencies)

```bash
npm install -g homebridge-switchbot-ble
cd tools/switchbot
npm install
```

### 2. Configure Cursor MCP Tool
Add the following configuration to `~/.cursor/mcp.json` (replace the path with your actual project path):

```json
{
  "tools": {
    "switchbot": {
      "command": [
        "C:\\path\\to\\project\\tools\\switchbot\\mcp-sdk-server.js"
      ]
    }
  }
}
```

### 3. Confirm SwitchBot CLI Path
Open `mcp-sdk-server.js` and ensure `SWITCHBOT_CLI_PATH` points to the correct `bot-cmd.mjs` path.

```js
const SWITCHBOT_CLI_PATH = 'C:\\Users\\<username>\\AppData\\Roaming\\npm\\node_modules\\homebridge-switchbot-ble\\bot-cmd.mjs';
```

## Usage

You can call the MCP tool directly in Cursor:

```javascript
// Scan SwitchBot devices
const scanResult = await mcp.tools.switchbot.scan();
console.log(scanResult);

// Press device
await mcp.tools.switchbot.press({ deviceId: 'AA:BB:CC:DD:EE:FF' });

// Turn on device
await mcp.tools.switchbot.on({ deviceId: 'AA:BB:CC:DD:EE:FF' });

// Turn off device
await mcp.tools.switchbot.off({ deviceId: 'AA:BB:CC:DD:EE:FF' });

// Query device status
const status = await mcp.tools.switchbot.status({ deviceId: 'AA:BB:CC:DD:EE:FF' });
console.log(status);
```

## Supported Tools
- scan: Scan for nearby devices
- status: Query device status
- press: Press device
- on: Turn on device
- off: Turn off device
- auto-on: Automatically turn on all devices
- auto-off: Automatically turn off all devices
- server: Query server status
- normalize: Normalize MAC address
- find: Find device by MAC address
- run: General command

## Testing

Run the following in the `tools/switchbot` directory:
```bash
npm run test-sdk
```

## FAQ
- Make sure the `SWITCHBOT_CLI_PATH` is correct
- Bluetooth must be enabled and devices must be in range
- If you encounter permission issues, run as administrator

## License
MIT
