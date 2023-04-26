import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as stream from "stream";
import * as Dot from "dot-object";
import Axios from "axios";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { promisify } from "util";
const TypeDetect = require("type-detect");

const streamFinished = promisify(stream.finished);

interface ConfigData {
    settings: {
        staticTags: {
            default: string[];
            e621: string[];
            e926: string[];
        };
        skipPreview: boolean;
        galleryPaths: string[];
    };
    metadata: {
        posts: any[];
        totalDownloads: number;
    };
}

const defaultConfigData: ConfigData = {
    settings: {
        staticTags: {
            default: [],
            e621: ["-blood", "-vore", "-feces", "-peeing", "-gore", "-scat", "-watersports", "-loli", "-shota"],
            e926: ["status:active"],
        },
        skipPreview: false,
        galleryPaths: [],
    },
    metadata: {
        posts: [],
        totalDownloads: 0,
    },
};

let configQueue: Promise<any> = Promise.resolve();

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 1000,
        minHeight: 700,
        icon: path.resolve(__dirname, "../public/media/favicon.ico"),
        webPreferences: { preload: path.join(__dirname, "preload.js"), nodeIntegration: true },
    });

    ipcMain.handle("program::readConfig", IpcReadConfig);
    ipcMain.handle("program::writeConfig", IpcWriteConfig);
    ipcMain.handle("program::downloadFile", IpcDownloadFile);
    ipcMain.handle("program::openLink", (event: Electron.IpcMainInvokeEvent, url: string) => shell.openExternal(url));
    ipcMain.handle("program::readDirectory", (event: Electron.IpcMainInvokeEvent, dir: string) => fs.readdirSync(dir));
    ipcMain.handle("program::openDirectory", async (event: Electron.IpcMainInvokeEvent) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: ["openDirectory"],
        });
        return canceled ? null : filePaths[0];
    });

    if (app.isPackaged) {
        win.removeMenu();
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL("http://localhost:3000/index.html");

        win.webContents.openDevTools();

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require("electron-reload")(__dirname, {
            electron: path.join(__dirname, "..", "..", "node_modules", ".bin", "electron" + (process.platform === "win32" ? ".cmd" : "")),
            forceHardReset: true,
            hardResetMethod: "exit",
        });
    }
}

app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});

const IpcReadConfig = (event: Electron.IpcMainInvokeEvent, filePath: string): ConfigData => {
    const configPath = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR || "", filePath);
    let configData: ConfigData;
    try {
        const configStr = fs.readFileSync(configPath, "utf-8");
        configData = JSON.parse(configStr);
    } catch (err: any) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfigData));
        return defaultConfigData;
    }

    let updated = false;
    for (const [key, value] of Object.entries(Dot.dot(defaultConfigData))) {
        const pick = Dot.pick(key, configData);
        if (pick === undefined || TypeDetect(pick) !== TypeDetect(value)) {
            Dot.set(key, value, configData);
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(configPath, JSON.stringify(configData));
    }

    return configData;
};

const IpcWriteConfig = (event: Electron.IpcMainInvokeEvent, updatedConfig: any, filePath: string): Promise<ConfigData> =>
    new Promise(
        (resolve, reject) =>
            (configQueue = configQueue.then(() => {
                try {
                    const configPath = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR || "", filePath);
                    const config: ConfigData = IpcReadConfig(event, filePath);
                    for (const [key, value] of Object.entries(updatedConfig)) {
                        Dot.set(key, value, config);
                    }
                    fs.writeFileSync(configPath, JSON.stringify(config));
                    resolve(config);
                } catch (err) {
                    reject(err);
                }
            }))
    );

const IpcDownloadFile = (event: Electron.IpcMainInvokeEvent, fileUrl: string, folderPath: string, fileName: string): Promise<any> => {
    const writer = fs.createWriteStream(path.resolve(folderPath, fileName));
    return Axios({
        method: "get",
        url: fileUrl,
        responseType: "stream",
    }).then((response) => {
        response.data.pipe(writer);
        return streamFinished(writer);
    });
};
