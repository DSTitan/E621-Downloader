import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("program", {
    selectDir: () => ipcRenderer.invoke("program::openDirectory"),
    downloadFile: (url: string, dirPath: string, filePath: string) => ipcRenderer.invoke("program::downloadFile", url, dirPath, filePath),
    readDir: (dirPath: string) => ipcRenderer.invoke("program::readDirectory", dirPath),
    openLink: (url: string) => ipcRenderer.invoke("program::openLink", url),
    readConfig: (filePath: string = "./program.config") => ipcRenderer.invoke("program::readConfig", filePath),
    writeConfig: (configData: any, filePath: string = "./program.config") => ipcRenderer.invoke("program::writeConfig", configData, filePath),
});
