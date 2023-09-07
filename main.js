const { app, BrowserWindow } = require('electron');
const server = require('./server');

// const path = require('path');
// const { webContents } = require('electron/main');

// Create the main window
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    
    //Show Full Screen view W/O Taskbar.
    // fullscreen: true,

    autoHideMenuBar: true, // Show the default top menu bar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

   // Maximize the window
   mainWindow.maximize();

  // mainWindow.loadURL('http://localhost:3000');
  mainWindow.loadFile('index.html');

  // Event when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
   
  });
}

// App ready event
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate event
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
