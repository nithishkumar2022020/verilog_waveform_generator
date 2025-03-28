# Verilog Waveform Visualizer

A Visual Studio Code extension that helps you visualize Verilog waveforms and provides linting capabilities for Verilog code.

## Features

- **Waveform Visualization**: Generate visual waveforms from your Verilog code
- **Linting**: Get real-time feedback on your Verilog code with built-in linting rules
- **Syntax Highlighting**: Full Verilog syntax highlighting support
- **Context Menu Integration**: Easy access to waveform generation and linting through the editor context menu

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Verilog Waveform Visualizer"
4. Click Install

## Usage

### Waveform Generation

1. Open a Verilog file (.v or .sv extension)
2. Right-click in the editor
3. Select "Generate Waveform" from the context menu
4. A new panel will open showing the waveform visualization

### Linting

1. Open a Verilog file
2. Right-click in the editor
3. Select "Lint Verilog" from the context menu
4. Any linting issues will be shown in the Problems panel

## Requirements

- Visual Studio Code version 1.98.0 or higher

## Extension Settings

This extension contributes the following settings:

* `verilogWaveformVisualizer.enableLinting`: Enable/disable linting
* `verilogWaveformVisualizer.lintingRules`: Configure custom linting rules

## Known Issues

- Waveform visualization is currently limited to basic signal representation
- Some complex Verilog constructs may not be fully supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the LICENSE file for details.
