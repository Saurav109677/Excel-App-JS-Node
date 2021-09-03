const {app, BrowserWindow} = require("electron")
const ejs = require('ejs-electron')
// const requirejs = require('requirejs');
// const $ = require('jquery')

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
        nodeIntegration:true, // enable node integration
        contextIsolation: false,
        enableRemoteModule: true
      }
    })
  
    win.loadFile('index.ejs').then(()=>{
      win.maximize();
      win.webContents.openDevTools()
    })
}

app.whenReady().then(() => {
    createWindow()
})

