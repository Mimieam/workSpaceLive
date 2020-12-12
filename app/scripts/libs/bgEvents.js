import { ChromeRPC } from './utils';

/**
 * This function is called everytime a primary event is fired by the browser
 *
 * @param  ev   a chrome event
 */

const THRESHOLD = 500
let start = Date.now();

const browserEventListener = async (e_name) => {
  if (Date.now() - start > THRESHOLD) {
    ChromeRPC.sendMessage({cmd: "REFRESH_STATE"}, (response) => {
      console.log(`[${e_name}] ev triggered [REFRESH_STATE] command. \n\t Output: `, response);
    })
    start = Date.now();
  }

};


chrome.windows.onCreated.addListener(()=> browserEventListener('windows.onCreated'));
chrome.windows.onRemoved.addListener(()=> browserEventListener('windows.onRemoved'));
chrome.tabs.onUpdated.addListener(()=> browserEventListener('tabs.onUpdated'))
chrome.tabs.onCreated.addListener(()=> browserEventListener('tabs.onCreated'))
chrome.tabs.onRemoved.addListener(()=> browserEventListener('tabs.onRemoved'))
chrome.tabs.onMoved.addListener(()=> browserEventListener('tabs.onMoved'))
