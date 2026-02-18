import { app, BrowserWindow } from 'electron';
import * as path from 'path';
// import html from './index.html?url'

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({});
    mainWindow.menuBarVisible
    mainWindow.setMenu(null);
    // Vite dev server URL
    // mainWindow.loadURL('http://localhost:5173');
    mainWindow.loadFile("out/renderer/index.electron.html");
    mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});