/**
 *  To setup a context menu,
 *
 * add the follwing to background/index.js

  import { contextMenuObject, onClickContextMenuHandler } from "./contextMenu";

  chrome.runtime.onInstalled.addListener(() => {
   chrome.contextMenus.create(contextMenuObject);
  })

  chrome.contextMenus.onClicked.addListener(onClickContextMenuHandler);
 */



let windowId = 0;
const CONTEXT_MENU_ID = 'ts2_context_menu';

export function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId);
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

export function popWindow(type) {
  closeIfExist();

  let _w = window.outerWidth / 3
  let _h = window.outerHeight / 3

  const options = {
    type: 'popup',
    left: 100,
    top: 100,
    width: _w,
    height: _h,
  };
  if (type === 'open') {
    options.url = 'popup.html';
    chrome.windows.create(options, (win) => {
      windowId = win.id;
      console.log(win)
    });
  }

}

// inspired from https://github.com/jhen0409/react-chrome-extension-boilerplate
export const contextMenuObject = {
  id: CONTEXT_MENU_ID,
  title: 'Open Context Menu',
  contexts: ['all'],
  documentUrlPatterns: [
    'https://**/*',
    'http://**/*'
  ]
}

export const onClickContextMenuHandler = (event) => {
  if (event.menuItemId === CONTEXT_MENU_ID) {
    popWindow('open');
  }
}
