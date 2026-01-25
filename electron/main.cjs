const { app, BrowserWindow } = require('electron');
const path = require('path');
// Dynamically import electron-is-dev to handle ESM/CJS interop if needed, 
// but standard require usually works if version is compatible. 
// For safety in this environment, we'll try/catch or use a simple heuristic.
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simple integration, though contextIsolation: true + preload is more secure
        },
        icon: path.join(__dirname, '../public/logo.png')
    });

    if (isDev) {
        // In dev, load localhost
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // In prod, load file
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
