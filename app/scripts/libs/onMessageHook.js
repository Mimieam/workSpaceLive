import browser from 'webextension-polyfill';
import React, { useState, useEffect } from 'react';


export const handleMessagePassing = (setState) => {
  chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {

      // requests to React ==>
      if (request.cmd == "REFRESH_STATE") {
        sendResponse({ cmd_res: "Windows State fetched and sent to React" });
        const windows = await browser.windows.getAll({ populate: true })
        const tabs = windows.map(w => w.tabs)
        setState([...tabs, []])
      }

      // requests to background <==
      switch (Object.keys(request)[0]) {
        case 'MOVE_TAB':
          //on move_tab
          sendResponse({ move_res: "moving tab" });
          const data = request.MOVE_TAB
          const [tabId, sI, wId, tIdx] = data.split(',').map(x=>+x)
          console.log([tabId, sI, wId, tIdx])
          if (wId)
            await browser.tabs.move([tabId], { windowId: wId, index: tIdx || -1 })
          else 
            await browser.windows.create({ tabId: tabId })
          break;

        default:
          break;
      }
        
    });
} 

// "sometime a man can be smart enought to be really stupid" ~ somebook

export  function useChromeMessagePassing(setState) {
  useEffect(() => {
    handleMessagePassing(setState)
    return () => { }
  }, [])
}

