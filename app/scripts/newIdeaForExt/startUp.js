import browser from 'webextension-polyfill';
import { generateRandomColor, ChromeRPC } from './utils';

let DEBUG = true
let newColor = ""

let CURRENT_WINDOW_ID = ""

const SET__CURRENT_WINDOW_ID = (id) => {
  CURRENT_WINDOW_ID = id
}

const browserEventListener = async (skip = false) => {
  ChromeRPC.sendMessage({current_window_id: CURRENT_WINDOW_ID})
  // console.error("[<->]=>browserEventListener: ")
  const win = await browser.windows.getLastFocused({populate:true});
  // const win_1 = await browser.windows.getCurrent({populate:true})
  // const allWindows = await GChromeWindow.getAll(false);

  // In Dev Mode  - set the generateRandomColor(true)
  newColor = generateRandomColor(true);
  // newColor = '#ff813f';
  let numOftabs = win.tabs.length;
  let displayText = `${ numOftabs }|${ win.id }`
  // console.log("displayText =", displayText ,  numOftabs)
  chrome.browserAction.setBadgeText({ text: `${displayText}` })
  // chrome.browserAction.setBadgeText({ text: `${win.id}` });
  chrome.browserAction.setBadgeBackgroundColor({ color: newColor });
};

chrome.tabs.onActivated.addListener(async (tab) => {
  // LAST_ACTIVE_WINDOW = tab.windowId
  await browserEventListener();
  // console.log('onActivated -- tab', tab);
})

let windowFocusHandler;
chrome.windows.onFocusChanged.addListener(windowFocusHandler = async (win) => {
  await browserEventListener();
  // DEBUG && console.log('onFocusChanged -- Win', win);
});

chrome.runtime.onInstalled.addListener(async(details) => {
  DEBUG && console.log('Running Version: ', details.previousVersion);
  DEBUG && console.log('Active Options: ', await getOptions());
  DEBUG && console.log('%c' + `Badge Color: ${newColor}`, `color:${newColor}`);
  DEBUG && console.log('onINSTALLED - CHrome RUNTIME');
  await browserEventListener();
});

chrome.runtime.onStartup.addListener(async() => {
  DEBUG && console.log('ON RUNTIME START UP');
  DEBUG && console.log('%c' + `Badge Color: ${newColor}`, `color:${newColor}`);
  await browserEventListener();
});