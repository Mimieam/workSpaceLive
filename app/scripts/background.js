import browser from 'webextension-polyfill';

import { DEFAULT_OPTIONS } from './libs/datamodel';
import { promisify } from './libs/utils';


let DEBUG = true
let OPENED_POPUP = []
let __clipboardContent = ''

chrome.browserAction.onClicked.addListener(async() => {
    console.log('OPENING FROM BACKGROUND');
    const parentWindow = await browser.windows.getCurrent();
    

    const parentConfig = {
        'width': parseInt(window.screen.width * (3 / 4)),
        'height': window.screen.height,
        'left': 0,
        'top': 0
    };
    const appConfig = {
        'width': window.screen.width - parentConfig.width,
        'height': parentConfig.height,
        'left': parentConfig.width,
        'top': 0
    };

    if (OPENED_POPUP.length) {
        const { popupId, parentId } = OPENED_POPUP[0]
        let _parentId =  parentWindow.id != parentId ? parentWindow.id: parentId
        console.log("_parentId = ",_parentId)
        await chrome.windows.update(popupId, {drawAttention: true, ...appConfig }, (w) => console.log(w));
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
                popupId: appWindow.tabs[0].id,
                parentId: parentWindow.id
            })
            console.log("OPENED_POPUP =", OPENED_POPUP)
        });
    }

    chrome.windows.onRemoved.addListener((id) => {
        OPENED_POPUP = OPENED_POPUP.filter(x => x.popupId != id)
        console.log("OPENED_POPUP =", OPENED_POPUP)
    })
});

/*
 * Chrome.browserAction.setBadgeText({ text: `${displayText}` })
 * chrome.browserAction.setBadgeBackgroundColor({ color: newColor });
 */

document.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', __clipboardContent);
    e.preventDefault();
});

const copyUrlsToClipboard = () => { }

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
    const w = await browser.windows.getCurrent({populate:true});
    
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

browser.webRequest.onBeforeRequest.addListener((req) => {
    OPENED_POPUP.some(x => {
        console.log(x.popupId,  req.tabId, x.popupId == req.tabId)
        return x.popupId == req.tabId
    })
    
    if (OPENED_POPUP.some(x => x.popupId == req.tabId) && !req.url.includes('nnlfihnjlcnpiddiilpmobjncpbhagnm')) {
        console.log("BLOCKED - ", req.url, req.tabId)
        return {redirectUrl: 'chrome-extension://nnlfihnjlcnpiddiilpmobjncpbhagnm/popup.html'};
        // return {cancel: true};
    } 
},{urls: ["<all_urls>"]},["blocking"])





const TS2 = {
    browser,
    DEFAULT_OPTIONS,
    console // Xpose the console here to share it with the popup
};

window.ts2 = TS2;
export default TS2;
