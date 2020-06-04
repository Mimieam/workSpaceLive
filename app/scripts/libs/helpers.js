/**
 * close any empty tabs
 *
 * @param {Array} tabs - array of tabs
 * @returns id of closed empty tabs
 */
export const closeTabs = async (tabsID) => {
    if (tabsID.length > 0) {
        browser.tabs.remove(tabsID, (t) => {
            DEBUG && console.log(`${ tabsID.length || 0 } closed`);
        });
    }
};
export const closeEmptyTabs = (tabs) => {
    const emptyTabs = tabs
        .filter((t) => t.url.includes('chrome://newtab/'))
        .map((t) => t.id);

    if (emptyTabs.length > 0) {
        chrome.tabs.remove(emptyTabs, (t) => {
            DEBUG && console.log(`${ emptyTabs.length || 0 } empty tabs closed`);
        });
    }

    return emptyTabs;
};

const findAndCloseDuplicateTabs = (_tabs = null) => {
    
    let tabs = _tabs.map(t => {return {...t ,...{url: t.url||t.pendingUrl}}})
    if (!tabs) { return }

    // get unique tabs - the one we will keep
    const uniqueTabs = deduplicateArrayOfObject(tabs, 'url');
    // console.log("uniqueTabs=>", uniqueTabs)
    const uniqueTabsArr = [...uniqueTabs.values()]
    // console.log("uniqueTabs=>", uniqueTabsArr)

    // get the unique IDs
    const uniqueTabsID = uniqueTabsArr.map((t) => t.id);

    //get the id of the tabs
    const allTabIDs = tabs.map((t) => t.id)
    const duplicates = allTabIDs.filter((id) => !uniqueTabsID.includes(id));

    closeTabs(duplicates);
    return uniqueTabsArr
};

const discardThisTab = (tabId) => {
    new Promise((resolve) => { 
        chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
            if (info.status === 'complete' && tabId === tab.id) {
                await chrome.tabs.discard(tab.id, (discaredTab) => {
                    console.log(`created & Unloaded from mem -> ${tab.url}`)
                })
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(tab);
            }
        })
    })
}


export const openTab = async ({ urls = [], wID = null, meta = {}}) => {
    // const t = await browser.tabs.create({ url:_url, windowId: windowId })
    let t 
    if (wID) {
        t = new Promise((resolve) => {
            chrome.tabs.create({ url:urls, windowId: wID , ...meta}, async(tab) => {
                resolve(tab);
            });
        })
    } else {
        t = new Promise((resolve) => {
            chrome.windows.create({ url: urls, ...meta }, async (w) => {
                console.log(w)
                resolve(w);
            });
        });
    }

    return t;
}