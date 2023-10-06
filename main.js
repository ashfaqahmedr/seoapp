const { app, BrowserWindow, Menu, MenuItem, ipcMain, globalShortcut,  screen } = require('electron');
const server = require('./server');
const path = require('path');

// Create the main window
let mainWindow;
function createWindow() {

      // Register a global shortcut to show the developer tools
      globalShortcut.register('Ctrl+Shift+D', () => {
        mainWindow.webContents.toggleDevTools();
      });
      
  // Create the browser window
   // Get the primary display's size
   const { width, height } = screen.getPrimaryDisplay().workAreaSize;


  mainWindow = new BrowserWindow({
    width: width,
    height: height,
 // autoHideMenuBar: true, // Show the default top menu bar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'seoapp.ico'),
  });

  // Maximize the window
  mainWindow.maximize();

  // Load your main application URL here
  mainWindow.loadFile('index.html');

  // Event when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Conditionally add a developer menu in production
 // Hide the default menu bar when the app is packaged
 if (app.isPackaged) {


  mainWindow.removeMenu();



} else {
  // Create and set the developer menu when in developer mode
  const developerMenu = new Menu();
  developerMenu.append(
    new MenuItem({
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: 'Reload',
          click: () => {
            mainWindow.reload();
          },
        },
        {
          label: 'Force Reload',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          },
        },
        {
          label: 'Show Console Logs',
          click: () => {
            // You can send logs to the renderer process to display them in your app
            mainWindow.webContents.send('show-logs');
          },
        },
      ],
    })
  );
  Menu.setApplicationMenu(developerMenu);


}

  // Listen for IPC message from the renderer process to show logs
  ipcMain.on('show-logs', () => {
    // This is just a simple example; you can customize how logs are displayed in your app
    // For instance, you can open a separate window to show logs or create a dedicated log view.
    console.log('Display logs here');
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
