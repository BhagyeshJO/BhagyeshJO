const path = require('node:path');
const { app, BrowserWindow } = require('electron');

/**
 * Create and configure the application window.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#f3f6fb',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));
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
