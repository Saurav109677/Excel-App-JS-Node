const {app, BrowserWindow} = require("electron")
const ejs = require('ejs-electron')
require('@electron/remote/main').initialize()
// const requirejs = require('requirejs');
// const $ = require('jquery')
// const ele = require('electron');

// requirejs.config({
//    //load the mode modules to top level JS file 
//    //by passing the top level main.js require function to requirejs
//    nodeRequire: require
// });

function createWindow () {
  
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
        enableRemoteModule: true,
        nodeIntegration:true, // enable node integration
        contextIsolation: false
        // preload: "./script.js"
      }
    })
    // console.log(ele);
    win.loadFile('index.ejs').then(()=>{
      win.maximize();
      win.webContents.openDevTools();
    })
}

app.whenReady().then(() => {
    createWindow()
})

