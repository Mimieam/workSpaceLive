import browser from 'webextension-polyfill';

import { DEFAULT_OPTIONS } from './libs/datamodel';
import { promisify } from './libs/utils';

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

    chrome.windows.create({
        'url': 'popup.html',
        'type': 'popup',
        ...appConfig
    }, async(appWindow) => {
        console.log('POP UP CREATED', appWindow.id);
        await chrome.windows.update(parentWindow.id, { ...parentConfig }, (pW) => console.log(pW));
        // Await chrome.windows.update(w.id, {drawAttention: true, ...appConfig }, (w)=> console.log(w));
    });
});

/*
 * Chrome.browserAction.setBadgeText({ text: `${displayText}` })
 * chrome.browserAction.setBadgeBackgroundColor({ color: newColor });
 */

const TS2 = {
    browser,
    DEFAULT_OPTIONS,
    console // Xpose the console here to share it with the popup
};

window.ts2 = TS2;

/*
 * Export {
 *     sortTabs, getOptions, DEFAULT_OPTIONS, TS2_OPTIONS, TS2
 * };
 */
export default TS2;
