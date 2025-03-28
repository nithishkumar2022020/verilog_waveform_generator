// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Verilog Waveform Visualizer is now active!');

	// Register Generate Waveform command
	let generateWaveformDisposable = vscode.commands.registerCommand('verilog-waveform-visualzer.generateWaveform', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}

		const document = editor.document;
		if (document.languageId !== 'verilog') {
			vscode.window.showErrorMessage('Please open a Verilog file first');
			return;
		}

		try {
			// Create a temporary directory for simulation files
			const tempDir = path.join(os.tmpdir(), 'verilog-sim-' + Date.now());
			fs.mkdirSync(tempDir);

			// Save the current file content
			const verilogFile = path.join(tempDir, 'design.v');
			fs.writeFileSync(verilogFile, document.getText());

			// Create a testbench file
			const testbenchFile = path.join(tempDir, 'testbench.v');
			const testbenchContent = generateTestbench(document.getText());
			fs.writeFileSync(testbenchFile, testbenchContent);

			// Compile and run simulation
			const vvpFile = path.join(tempDir, 'sim.vvp');
			execSync(`iverilog -o ${vvpFile} ${verilogFile} ${testbenchFile}`);
			execSync(`vvp ${vvpFile}`);

			// Generate VCD file
			const vcdFile = path.join(tempDir, 'sim.vcd');
			if (!fs.existsSync(vcdFile)) {
				throw new Error('VCD file was not generated');
			}

			// Open GTKWave
			execSync(`gtkwave ${vcdFile}`);

			vscode.window.showInformationMessage('Waveform visualization started in GTKWave');
		} catch (error) {
			vscode.window.showErrorMessage(`Error generating waveform: ${error.message}`);
		}
	});

	// Register Lint command
	let lintDisposable = vscode.commands.registerCommand('verilog-waveform-visualzer.lint', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}

		const document = editor.document;
		if (document.languageId !== 'verilog') {
			vscode.window.showErrorMessage('Please open a Verilog file first');
			return;
		}

		try {
			const verilogCode = document.getText();
			const diagnostics = lintVerilogCode(verilogCode);
			
			// Create diagnostic collection
			const diagnosticCollection = vscode.languages.createDiagnosticCollection('verilog');
			
			// Convert diagnostics to VS Code format
			const vscodeDiagnostics = diagnostics.map(diagnostic => {
				const range = new vscode.Range(
					new vscode.Position(diagnostic.line - 1, diagnostic.column - 1),
					new vscode.Position(diagnostic.line - 1, diagnostic.column + diagnostic.length - 1)
				);
				return new vscode.Diagnostic(
					range,
					diagnostic.message,
					diagnostic.severity
				);
			});

			// Set diagnostics for the current file
			diagnosticCollection.set(document.uri, vscodeDiagnostics);
		} catch (error) {
			vscode.window.showErrorMessage(`Error linting Verilog code: ${error.message}`);
		}
	});

	context.subscriptions.push(generateWaveformDisposable, lintDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

/**
 * Generate a testbench for the Verilog module
 * @param {string} verilogCode The original Verilog code
 * @returns {string} Generated testbench code
 */
function generateTestbench(verilogCode) {
	// Extract module name and ports
	const moduleMatch = verilogCode.match(/module\s+(\w+)\s*\((.*?)\)/);
	if (!moduleMatch) {
		throw new Error('No module declaration found');
	}

	const moduleName = moduleMatch[1];
	const ports = moduleMatch[2].split(',').map(port => port.trim());

	// Generate testbench
	return `
module ${moduleName}_tb;
	${ports.map(port => `reg ${port};`).join('\n    ')}
	
	${moduleName} dut(${ports.join(', ')});
	
	initial begin
		$dumpfile("sim.vcd");
		$dumpvars(0, ${moduleName}_tb);
		
		// Add your test vectors here
		#10;
		
		$finish;
	end
endmodule
	`;
}

/**
 * Lint Verilog code
 * @param {string} code Verilog code
 * @returns {Array} Diagnostics
 */
function lintVerilogCode(code) {
	const diagnostics = [];
	
	// Basic linting rules
	const lines = code.split('\n');
	lines.forEach((line, index) => {
		// Check for missing semicolons
		if (line.trim().endsWith(';') === false && line.trim() !== '') {
			diagnostics.push({
				line: index + 1,
				column: line.length + 1,
				length: 1,
				message: 'Missing semicolon',
				severity: vscode.DiagnosticSeverity.Error
			});
		}

		// Check for proper module declaration
		if (line.includes('module') && !line.includes('endmodule')) {
			diagnostics.push({
				line: index + 1,
				column: 1,
				length: line.length,
				message: 'Module declaration should be followed by endmodule',
				severity: vscode.DiagnosticSeverity.Warning
			});
		}
	});

	return diagnostics;
}

module.exports = {
	activate,
	deactivate
}
