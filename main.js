const {app, BrowserWindow, Menu} = require('electron')
  const path = require('path')
  const url = require('url')
  
  const template = [
    {
      label: "Toggle Full Screen",
      visible: false,
      accelerator: "Esc",
      click(item, focusedWindow) {
          if (focusedWindow.isFullScreen()) {
              focusedWindow.setFullScreen(false)
          }
          else {
              focusedWindow.setFullScreen(true)
          }
      },
  }
    
 ]

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, autoHideMenuBar:true})

    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  app.on('ready', createWindow)