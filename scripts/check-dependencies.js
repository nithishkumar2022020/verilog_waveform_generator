const { execSync } = require('child_process');
const os = require('os');
const vscode = require('vscode');

function checkDependencies() {
    const platform = os.platform();
    let iverilogInstalled = false;
    let gtkwaveInstalled = false;

    try {
        execSync('iverilog --version');
        iverilogInstalled = true;
    } catch (error) {
        console.log('Icarus Verilog is not installed');
    }

    try {
        execSync('gtkwave --version');
        gtkwaveInstalled = true;
    } catch (error) {
        console.log('GTKWave is not installed');
    }

    if (!iverilogInstalled || !gtkwaveInstalled) {
        let message = 'Required dependencies are missing:\n';
        if (!iverilogInstalled) message += '- Icarus Verilog\n';
        if (!gtkwaveInstalled) message += '- GTKWave\n\n';
        
        message += 'Please install the missing dependencies:\n';
        
        switch (platform) {
            case 'darwin':
                message += 'macOS: brew install icarus-verilog gtkwave';
                break;
            case 'linux':
                message += 'Ubuntu/Debian: sudo apt-get install iverilog gtkwave\n';
                message += 'Fedora: sudo dnf install iverilog gtkwave';
                break;
            case 'win32':
                message += 'Windows: Download and install from:\n';
                message += '1. Icarus Verilog: http://bleyer.org/icarus/\n';
                message += '2. GTKWave: http://gtkwave.sourceforge.net/';
                break;
        }

        vscode.window.showErrorMessage(message);
    }
}

checkDependencies(); 