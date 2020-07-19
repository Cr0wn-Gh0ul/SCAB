const { app, BrowserWindow, ipcMain } = require('electron')
const { channels } = require('./constants');
const isDev = require('electron-is-dev');

const fs = require('fs');
const path = require('path');
const url = require('url');
const { fork } = require('child_process')

let server;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js'),
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/')
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

}

function startServer() {
  server = fork(path.join(__dirname, '../ganacheServer.js'));
}

app.on('ready', async () => {
  startServer();
  createWindow();
});

app.on('before-quit', () => {
  if (server) {
    server.kill();
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    startServer();
    createWindow();
  }
})

ipcMain.on(channels.CONTRACT, (event) => {
  let rawData;
  if (isDev) {
    rawData = fs.readFileSync(path.join(__dirname, '../../contractInfo.json'));
  } else {
    rawData = fs.readFileSync(path.join(__dirname, '../contractInfo.json'));
  }
  let contractInfo = JSON.parse(rawData);
  event.sender.send(channels.CONTRACT, contractInfo);
});
