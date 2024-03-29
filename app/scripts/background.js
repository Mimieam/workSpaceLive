import browser from 'webextension-polyfill';


// import { getOverlappingMonitor } from './libs/multiScreen';
// import { handleMessagePassing } from './libs/onMessageHook';

import './libs/contextMenu'
import './libs/bgEvents'


let DEBUG = true
let OPENED_POPUP = []
let __clipboardContent = ''


let portFromPOPUP;

// browser.runtime.onConnect.addListener(handleMessagePassing);
browser.runtime.onConnect.addListener((port) => {
    portFromPOPUP = port
    port.onMessage.addListener(async (request) => {
        console.log(request)
        if (request.GET_POPUP_INFO) {
            console.log("GET_POPUP_INFO:  ", request.GET_POPUP_INFO, console.log(OPENED_POPUP))
            await portFromPOPUP.postMessage({ POPUP_INFO: JSON.stringify(...OPENED_POPUP) })
          }

          // requests to background <==
          if (request.MOVE_TAB) {
            const data = request.MOVE_TAB
            const [tabId, sI, wId, tIdx] = data.split(',').map(x => +x)
            if (wId)
              await browser.tabs.move([tabId], { windowId: wId, index: tIdx || -1 })
            else
              await browser.windows.create({ tabId: tabId })
            return
          }

          if (request.TOGGLE_PIN) {
            const data = request.TOGGLE_PIN
            const [tabId, ..._] = data.split(',').map(x => +x)
            browser.tabs.update(tabId, { pinned: !(await browser.tabs.get(tabId))?.pinned })
            return
          }

          if (request.BRING_FORWARD) {
            // console.log(request.BRING_FORWARD)
            const data = request.BRING_FORWARD
            const [windowId, tabIndex] = data.split(',').map(x => +x)
            await browser.windows.update(windowId, {focused: true})
            await browser.tabs.highlight({ windowId: windowId, tabs: tabIndex })
            const lastID = (await browser.windows.getLastFocused())?.id
            // console.log(`lastID = ${lastID}`)
            // console.log(`OPENED_POPUP =`, OPENED_POPUP)
            const { popupWindowId, parentId } = OPENED_POPUP[0]

            await browser.windows.update(popupWindowId, {focused: true})
            await browser.tabs.highlight({ windowId: popupWindowId, tabs: 0 })
            // console.log(`popupWindowId = ${popupWindowId}`)
          }

          if (request.CLOSE_TAB) {
            const data = request.CLOSE_TAB
            const [tabId, ..._] = data.split(',').map(x => +x)
            await browser.tabs.remove([tabId])
          }

    })
})

// handleMessagePassing()

chrome.action.onClicked.addListener(async() => {
    console.log('OPENING FROM BACKGROUND');
    // const currentMonitor = await getOverlappingMonitor()
        // SW doesn't have window so we need the screen using this... - might need to test with multiple Screen..
    const [{workArea}] = await browser.system.display.getInfo()
    const currentMonitor = workArea;

    console.log(currentMonitor)
    const parentWindow = await browser.windows.getCurrent();


    const parentConfig = {
        'width': parseInt(currentMonitor.width * (3 / 4)),
        'height': currentMonitor.height,
        // 'height': parseInt(currentMonitor.height * (4 / 5)),
        // 'height': parseInt(currentMonitor.height * (2 / 4)),
        'left': currentMonitor.left,
        'top': currentMonitor.top
    };
    const appConfig = {
        'width': currentMonitor.width - parentConfig.width,
        'height': parentConfig.height,
        'left': currentMonitor.left + parentConfig.width,
        'top': currentMonitor.top
    };

    if (OPENED_POPUP.length) {
        // console.log("OPENED_POPUP =")
        // console.log(OPENED_POPUP)
        const { popupWindowId, parentId } = OPENED_POPUP[0]
        let _parentId =  parentWindow.id != parentId ? parentWindow.id: parentId
        // console.log("_parentId = ",_parentId, popupWindowId)
        await browser.windows.update(popupWindowId, {focused: true})
        await browser.tabs.highlight({ windowId: popupWindowId, tabs: 0 })
        //
        browser.windows.update(popupWindowId, {drawAttention: true, ...appConfig }).then((w) => console.log(w));
        browser.windows.update(_parentId, { drawAttention: true, ...parentConfig }).then((w) => console.log(w));

    } else {
        browser.windows.create({
            'url': 'popup.html',
            'type': 'popup',
            ...appConfig
        }).then(async (appWindow) => {

            console.log('POP UP CREATED', appWindow.id, appWindow);
            await browser.windows.update(parentWindow.id, { ...parentConfig })
            // await browser.windows.update(parentWindow.id, { ...parentConfig }, (pW) => console.log(pW));
            OPENED_POPUP.push({
                popupWindowId: appWindow.id,
                popupTabId: appWindow.tabs[0].id,
                parentId: parentWindow.id
            })
                console.log("OPENED_POPUP =", OPENED_POPUP)
        });
    }
    portFromPOPUP?.postMessage({ POPUP_INFO: JSON.stringify(...OPENED_POPUP) })
    // chrome.developerPrivate.openDevTools({ extensionId: "nnlfihnjlcnpiddiilpmobjncpbhagnm" }, () => { console.log('DevTool Opened')})

});




chrome.windows.onRemoved.addListener((id) => {
    console.log("closing window id = ",id)
    console.log(OPENED_POPUP)
    OPENED_POPUP = OPENED_POPUP.filter(x => x.popupWindowId != id)
    console.log("filtered after removed =", OPENED_POPUP)
})


/*
 * Chrome.action.setBadgeText({ text: `${displayText}` })
 * chrome.action.setBadgeBackgroundColor({ color: newColor });
 */

// document.addEventListener('copy', (e) => {
//     e.clipboardData.setData('text/plain', __clipboardContent);
//     e.preventDefault();
// });

const copyUrlsToClipboard = () => {


 }

const openUrls = async (_urls, windowId) => {

    const openTabs = await _urls.map(
        async (_url, idx) => {
            DEBUG && console.log(`opening : "${_url}"`);
            const t = await browser.tabs.create({ url:_url, windowId: windowId })
            console.log(t)
            return t
        }
    );
    return openTabs
}

// browser.commands.onCommand.addListener(async (command) => {
//     const w = await browser.windows.getCurrent({ populate: true });

//     switch (command) {
//         case 'copy_all_url':
//             const text = w.tabs.flatMap(t => t.url).filter(x => x).join(',\n')
//             __clipboardContent = text
//             document.execCommand('copy')
//             console.log('Command:', command);
//             console.log(__clipboardContent)
//             break;
//         case 'open_copied_url':
//             const url = __clipboardContent.split(',\n')
//             console.log(url)
//             const res = openUrls(url, w.id)
//             console.log(res)
//             break;
//         default:
//             break;
//     }
// });


// /**
//  *  requires  permissions: - disabling this for now
// *   "<all_urls>",
//  *  "webRequest",
//     "webRequestBlocking",
//  * */
// browser.webRequest?.onBeforeRequest.addListener((req) => {
//     OPENED_POPUP.some(x => {
//         console.log(x.popupTabId,  req.tabId, x.popupTabId == req.tabId)
//         return x.popupTabId == req.tabId
//     })

//     if (OPENED_POPUP.some(x => x.popupTabId == req.tabId) && !req.url.includes('nnlfihnjlcnpiddiilpmobjncpbhagnm')) {
//         console.log("BLOCKED - ", req.url, req.tabId)
//         return {redirectUrl: 'chrome-extension://nnlfihnjlcnpiddiilpmobjncpbhagnm/popup.html'};
//         // return {cancel: true};
//     } 
// },{urls: ["<all_urls>"]},["blocking"])





const Rika = {
    browser,
    OPENED_POPUP,
};

globalThis.Rika = Rika;
export default Rika;
