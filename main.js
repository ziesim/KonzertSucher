const electron = require("electron");
const { MenuItem } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const { app, BrowserWindow, Menu, ipcMain, session, dialog } = electron;

// Set env
process.env.NODE_ENV = "";

let mainWindow;

// Listen for app to be ready
app.on("ready", function () {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "Datei",
    submenu: [
      {
        label: "Drucken",

        // Create shortcut for print
        accelerator: process.platform == "darwin" ? "Command+P" : "Ctrl + P",

        click() {
          console.log("DRUCKEN");
        },
      },
      {
        label: "Rückgängig",

        // Create shortcut for backward
        accelerator: process.platform == "darwin" ? "Command+Z" : "Ctrl + Z",

        click() {
          console.log("Rückgängig");
        },
      },
      {
        label: "Wiederherstellen",

        // Create shortcut for redo
        accelerator: process.plattform == "darwin" ? "Command+Y" : "Ctrl+Y",

        click() {
          console.log("Wiederherstellen");
        },
      },
      {
        label: "Quit",

        // Create shortcut for quit
        accelerator: process.plattform == "darwin" ? "Command+Q" : "Ctrl+Q",

        // Create function to close window
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If macOs, add empty object to menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
