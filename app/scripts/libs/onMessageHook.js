import browser from 'webextension-polyfill';
import React, { useState, useEffect } from 'react';

let POPUP_INFO = null


export let port = browser.runtime.connect({ name: "portFromPopup" });


export const handleMessagePassing = (setState) => {
  // port.onMessage.addListener(
  chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

      // requests to React ==>
      if (request.cmd == "REFRESH_STATE") {
        console.log("POPUP_INFO", POPUP_INFO)
        port.postMessage({ cmd_res: "Windows State fetched and sent to React" });
        const windows = await browser.windows.getAll({ populate: true })
        const tabs = windows.filter(w => w.id != POPUP_INFO?.popupWindowId).map(w => w.tabs)
        console.log("tabs", windows)
        setState([...tabs, ...[]])
      }

      if (request.POPUP_INFO) {
        console.log("parsed POPUP_INFO", POPUP_INFO)
        port.postMessage({ POPUP_INFO_RES: "Received the POPUP_INFO" });
        POPUP_INFO = await JSON.parse(request.POPUP_INFO)
      }

      // requests to background <==
      // if (request.MOVE_TAB) {
      //   const data = request.MOVE_TAB
      //   const [tabId, sI, wId, tIdx] = data.split(',').map(x => +x)
      //   if (wId)
      //     await browser.tabs.move([tabId], { windowId: wId, index: tIdx || -1 })
      //   else
      //     await browser.windows.create({ tabId: tabId })
      //   return 
      // }
      
      // if (request.TOGGLE_PIN) {
      //   const data = request.TOGGLE_PIN
      //   const [tabId, ..._] = data.split(',').map(x => +x)
      //   chrome.tabs.update(tabId, { pinned: !(await browser.tabs.get(tabId))?.pinned })
      //   return 
      // }

      // if (request.BRING_FORWARD) {
      //   const data = request.BRING_FORWARD
      //   const [windowId, tabIndex] = data.split(',').map(x => +x)
      //   await browser.windows.update(windowId, {focused: true})
      //   await browser.tabs.highlight({ windowId: windowId, tabs: tabIndex })
      //   // await browser.windows.update((await browser.windows.getLastFocused())?.id, {focused: true})
      // }

      // if (request.CLOSE_TAB) {
      //   const data = request.CLOSE_TAB
      //   const [tabId, ..._] = data.split(',').map(x => +x)
      //   await browser.tabs.remove([tabId])
      // }

    });
}

// "sometime a man can be smart enought to be really stupid" ~ somebook

export function useChromeMessagePassing(setState) {
  useEffect(() => {
    handleMessagePassing(setState)
    return () => { }
  }, [])
}

