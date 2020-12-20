import browser from 'webextension-polyfill';
import React, { useState, useEffect } from 'react';

let POPUP_INFO = null


export let port = browser.runtime.connect({ name: "portFromPopup" });


export const handleMessagePassing = (setState, setFetchedTabs, setPopupWindow) => {

//  this notify the background to send the POPUP_INFO ...  because the popup.html does not know it's own window/tab ID
  port.postMessage({"GET_POPUP_INFO": "Popup is Open and Connected"})

  // port.onMessage.addListener(
  chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

      // requests to React ==>
      if (request.cmd == "REFRESH_STATE") {
        console.log("bg::REFRESH_STATE")
        sendResponse({ cmd_res: "Windows State fetched and sent to React" });
                // port.postMessage({ cmd_res: "Windows State fetched and sent to React" });
        const windows = await browser.windows.getAll({ populate: true })
        const tabs = windows.filter(w => w.id != POPUP_INFO?.popupWindowId).map(w => w.tabs)
        await setFetchedTabs(tabs)
        setState(tabs)
        console.log("tabs ~~~", windows)
        // setState([...tabs, ...[]])
        console.log("RESET INITIAL TABS")
      }
      // if (request.POPUP_INFO) {
      //   console.log("received ianything??")
      //   port.postMessage({ POPUP_INFO_RES: "Received the POPUP_INFO" });
      //   POPUP_INFO = await JSON.parse(request.POPUP_INFO)
      //   console.log("parsed POPUP_INFO", POPUP_INFO)
      //   await setPopupWindow(POPUP_INFO)
      // }
    });
    port.onMessage.addListener(
      async function (request, sender, sendResponse) {
        if (request.POPUP_INFO) {
          console.log("received ianything??")
          port.postMessage({ POPUP_INFO_RES: "Received the POPUP_INFO" });
          POPUP_INFO = await JSON.parse(request.POPUP_INFO)
          console.log("parsed POPUP_INFO", POPUP_INFO)
          await setPopupWindow(POPUP_INFO)
        }
      }
    );  
}




// "sometime a man can be smart enought to be really stupid" ~ somebook

export function useChromeMessagePassing(setState, setFetchedTabs, setPopupWindow) {
  useEffect(() => {
    handleMessagePassing(setState, setFetchedTabs, setPopupWindow)
    return () => { }
  }, [])
}

