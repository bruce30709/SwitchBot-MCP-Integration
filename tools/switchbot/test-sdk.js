// Test SwitchBot MCP SDK server implementation
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// MCP server path
const MCP_SERVER_PATH = path.join(__dirname, 'mcp-sdk-server.js');

console.log(`Starting MCP SDK server: ${MCP_SERVER_PATH}`);

// Start MCP server process
const serverProcess = spawn('node', [MCP_SERVER_PATH], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Message ID counter
let messageId = 1;

// List to store available devices
let availableDevices = [];

// Display server standard output
serverProcess.stdout.on('data', (data) => {
    try {
        const response = JSON.parse(data.toString().trim());
        console.log('\n📥 Server response:', JSON.stringify(response, null, 2));

        // Handle scan result, extract device list
        if (response.result && response.result.content) {
            const content = response.result.content;
            if (content[0] && content[0].text) {
                const text = content[0].text;
                // Extract device IDs
                const deviceMatch = text.match(/Device ID: ([a-f0-9:]+)/gi);
                if (deviceMatch) {
                    availableDevices = deviceMatch.map(match => {
                        return match.replace('Device ID: ', '').trim();
                    });
                    if (availableDevices.length > 0) {
                        console.log(`Found ${availableDevices.length} devices:`, availableDevices);
                    }
                }
            }
        }
    } catch (error) {
        // Ignore non-JSON data
        console.log('Server output:', data.toString().trim());
    }
});

// Display server error output
serverProcess.stderr.on('data', (data) => {
    console.log('Server log:', data.toString().trim());
});

// Create command line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display help information
console.log('\n=== SwitchBot MCP SDK Test Console ===');
console.log('Available commands:');
console.log('1. scan - Scan for nearby SwitchBot devices');
console.log('2. status [deviceId] - Get device status');
console.log('3. press [deviceId] - Press device');
console.log('4. on [deviceId] - Turn on device');
console.log('5. off [deviceId] - Turn off device');
console.log('6. auto-on - Automatically turn on all devices');
console.log('7. auto-off - Automatically turn off all devices');
console.log('8. server - Get server status');
console.log('9. help - Show help information');
console.log('10. quit - Exit test\n');

// Send request to MCP server
function sendRequest(method, params = {}) {
    const request = {
        jsonrpc: '2.0',
        id: messageId++,
        method,
        params
    };

    console.log(`\n📤 Sending request: ${JSON.stringify(request)}`);
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
}

// Handle user input
rl.on('line', (line) => {
    const input = line.trim();

    if (!input) {
        return;
    }

    if (input === 'quit' || input === 'exit') {
        console.log('Shutting down server and exiting...');
        serverProcess.kill();
        rl.close();
        process.exit(0);
        return;
    }

    if (input === 'help') {
        console.log('\n=== Available Commands ===');
        console.log('scan - Scan for nearby SwitchBot devices');
        console.log('status [deviceId] - Get device status');
        console.log('press [deviceId] - Press device');
        console.log('on [deviceId] - Turn on device');
        console.log('off [deviceId] - Turn off device');
        console.log('auto-on - Automatically turn on all devices');
        console.log('auto-off - Automatically turn off all devices');
        console.log('server - Get server status');
        console.log('help - Show help information');
        console.log('quit/exit - Exit test\n');
        return;
    }

    // Parse command and parameter
    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const param = parts.slice(1).join(' ');

    // Handle various commands
    switch (command) {
        case 'scan':
            sendRequest('scan');
            break;
        case 'status':
            sendRequest('status', param ? { deviceId: param } : {});
            break;
        case 'press':
            if (!param) {
                console.log('Error: Missing device ID parameter');
                return;
            }
            sendRequest('press', { deviceId: param });
            break;
        case 'on':
            if (!param) {
                console.log('Error: Missing device ID parameter');
                return;
            }
            sendRequest('on', { deviceId: param });
            break;
        case 'off':
            if (!param) {
                console.log('Error: Missing device ID parameter');
                return;
            }
            sendRequest('off', { deviceId: param });
            break;
        case 'auto-on':
            sendRequest('auto-on');
            break;
        case 'auto-off':
            sendRequest('auto-off');
            break;
        case 'server':
            sendRequest('server');
            break;
        default:
            console.log(`Unknown command: ${command}`);
            break;
    }
});

// Handle exit
rl.on('close', () => {
    console.log('Closing test console...');
    serverProcess.kill();
    process.exit(0);
});

// Handle server process exit
serverProcess.on('exit', (code) => {
    console.log(`Server process exited, code: ${code}`);
    rl.close();
    process.exit(code);
}); 