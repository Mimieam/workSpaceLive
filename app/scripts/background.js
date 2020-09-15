import browser from 'webextension-polyfill';

// import { DEFAULT_OPTIONS } from './libs/datamodel';
// import { promisify } from './libs/utils';
import { getOverlappingMonitor } from './libs/multiScreen';

import { handleMessagePassing } from './libs/onMessageHook'
import './libs/contextMenu'
import './libs/bgEvents'

let DEBUG = true
let OPENED_POPUP = []
let __clipboardContent = ''

chrome.browserAction.onClicked.addListener(async() => {
    console.log('OPENING FROM BACKGROUND');
    const currentMonitor = await getOverlappingMonitor()
    console.log(currentMonitor)
    const parentWindow = await browser.windows.getCurrent();
    

    const parentConfig = {
        'width': parseInt(currentMonitor.width * (3 / 4)),
        // 'height': currentMonitor.height,
        'height': parseInt(currentMonitor.height * (4 / 5)),
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
        console.log("OPENED_POPUP =", OPENED_POPUP)
        const { popupWindowId, parentId } = OPENED_POPUP[0]
        let _parentId =  parentWindow.id != parentId ? parentWindow.id: parentId
        console.log("_parentId = ",_parentId, popupWindowId)
        await chrome.windows.update(popupWindowId, {drawAttention: true, ...appConfig }, (w) => console.log(w));
        await chrome.windows.update(_parentId, {drawAttention: true, ...parentConfig }, (w) => console.log(w));

    } else {
        chrome.windows.create({
            'url': 'popup.html',
            'type': 'popup',
            ...appConfig
        }, async(appWindow) => {
            console.log('POP UP CREATED', appWindow.id, appWindow);
            await chrome.windows.update(parentWindow.id, { ...parentConfig }, (pW) => console.log(pW));
            OPENED_POPUP.push({
                popupWindowId: appWindow.id,
                popupTabId: appWindow.tabs[0].id,
                parentId: parentWindow.id
            })
            console.log("OPENED_POPUP =", OPENED_POPUP)
        });
    }

    chrome.windows.onRemoved.addListener((id) => {
        console.log("closing window id = ",id)
        console.log(OPENED_POPUP)
        OPENED_POPUP = OPENED_POPUP.filter(x => x.popupWindowId != id)
        console.log("filtered after removed =", OPENED_POPUP)
    })


    // chrome.developerPrivate.openDevTools({ extensionId: "nnlfihnjlcnpiddiilpmobjncpbhagnm" }, () => { console.log('DevTool Opened')})

});

handleMessagePassing()

/*
 * Chrome.browserAction.setBadgeText({ text: `${displayText}` })
 * chrome.browserAction.setBadgeBackgroundColor({ color: newColor });
 */

document.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', __clipboardContent);
    e.preventDefault();
});

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

browser.commands.onCommand.addListener(async (command) => {
    const w = await browser.windows.getCurrent({ populate: true });
    
    switch (command) {
        case 'copy_all_url': 
            const text = w.tabs.flatMap(t => t.url).filter(x => x).join(',\n')
            __clipboardContent = text
            document.execCommand('copy')
            console.log('Command:', command);
            console.log(__clipboardContent)
            break;
        case 'open_copied_url': 
            const url = __clipboardContent.split(',\n')
            console.log(url)
            const res = openUrls(url, w.id)
            console.log(res)
            break;
        default:
            break;
    }
});


/**
 *  requires  permissions: - disabling this for now
*   "<all_urls>",
 *  "webRequest",
    "webRequestBlocking",
 * */ 
browser.webRequest?.onBeforeRequest.addListener((req) => {
    OPENED_POPUP.some(x => {
        console.log(x.popupTabId,  req.tabId, x.popupTabId == req.tabId)
        return x.popupTabId == req.tabId
    })
    
    if (OPENED_POPUP.some(x => x.popupTabId == req.tabId) && !req.url.includes('nnlfihnjlcnpiddiilpmobjncpbhagnm')) {
        console.log("BLOCKED - ", req.url, req.tabId)
        return {redirectUrl: 'chrome-extension://nnlfihnjlcnpiddiilpmobjncpbhagnm/popup.html'};
        // return {cancel: true};
    } 
},{urls: ["<all_urls>"]},["blocking"])





const TS2 = {
    browser,
    // DEFAULT_OPTIONS,
    console // Xpose the console here to share it with the popup
};

window.ts2 = TS2;
export default TS2;
