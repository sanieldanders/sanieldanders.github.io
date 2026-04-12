const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NG_DEV_SERVER === '1';

function dataFilePath() {
  return path.join(app.getPath('userData'), 'jutsu-companion-data.json');
}

function loadData() {
  try {
    const p = dataFilePath();
    if (!fs.existsSync(p)) {
      return { profiles: [] };
    }
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.profiles)) {
      return { profiles: [] };
    }
    return parsed;
  } catch {
    return { profiles: [] };
  }
}

function saveData(data) {
  const dir = path.dirname(dataFilePath());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath(), JSON.stringify(data, null, 2), 'utf8');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });

  win.once('ready-to-show', () => win.show());

  if (isDev) {
    win.loadURL('http://127.0.0.1:4200');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, '..', 'dist', 'jutsu-companion', 'browser', 'index.html');
    win.loadFile(indexHtml);
  }
}

app.whenReady().then(() => {
  ipcMain.handle('storage:load', () => loadData());
  ipcMain.handle('storage:save', (_event, payload) => {
    saveData(payload);
    return true;
  });

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
