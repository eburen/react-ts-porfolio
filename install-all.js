const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Install root dependencies
console.log('Installing root dependencies...');
execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

// Install client dependencies if client/package.json exists
const clientPackageJsonPath = path.join(__dirname, 'client', 'package.json');
if (fs.existsSync(clientPackageJsonPath)) {
    console.log('Installing client dependencies...');
    execSync('cd client && npm install --legacy-peer-deps', { stdio: 'inherit' });
}

console.log('All dependencies installed successfully.'); 