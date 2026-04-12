const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jutsuElectron', {
  isElectron: true,
  load: () => ipcRenderer.invoke('storage:load'),
  save: (data) => ipcRenderer.invoke('storage:save', data)
});
