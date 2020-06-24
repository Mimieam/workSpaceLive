// thanks to https://stackoverflow.com/a/50936590/623546
/**
 * Dynamic ws context menu
 * 
 */

import WS_MANAGER, { ws, formatId, formatName } from './neoWorkSpace'
import browser from 'webextension-polyfill';
import { randomId, interleave } from './helpers'
import { ChromeRPC, generateRandomColor } from "./utils";
// import './startUp'

window.WS_MANAGER = WS_MANAGER
let CURRENT_WINDOW_ID = null

const browserEventListener = async (skip = false) => {
  const win = await browser.windows.getLastFocused({ populate: true });
  CURRENT_WINDOW_ID = win.id
  // let newColor = generateRandomColor(true);
  // // let numOftabs = win.tabs.length;
  // // let displayText = `${ numOftabs }|${ win.id }`
  // // chrome.browserAction.setBadgeText({ text: `${displayText}` })
  // // chrome.browserAction.setBadgeBackgroundColor({ color: newColor });
};

chrome.tabs.onActivated.addListener(async (tab) => {
  await browserEventListener();
})

let windowFocusHandler;
chrome.windows.onFocusChanged.addListener(windowFocusHandler = async (win) => {
  await browserEventListener();
});

chrome.runtime.onStartup.addListener(async() => {
  DEBUG && console.log('ON RUNTIME START UP');
  DEBUG && console.log('%c' + `Badge Color: ${newColor}`, `color:${newColor}`);
  await browserEventListener();
});

// ChromeRPC.onMessage(async (request, sender, sendResponse) => {
//   //  all the commands that needs to be refreshed when new options are sets
//   if (request.current_window_id) { // set current working window
//       CURRENT_WINDOW_ID = request.current_window_id
//   }
//   console.log(`CURRENT_WINDOW_ID = ${CURRENT_WINDOW_ID}`)
// });


const genCtxMenuEntry = ({ _ws = {}, ctx = null, parentId = null, act = true, withSubmenu = false, id = null, title = null, type = 'normal' }) => {

  const _id = formatId(_ws?.name || id)
  const _name = formatName(_ws?.name || title)

  return {
    id: _id,
    title: _name,
    ...(act && { act: (info, tab) => { console.log(`Menu component ${ _id }`) } }),
    ...(withSubmenu && { menu: generateUniqueSubMenu(WORKSPACEMENU, _id) }),
    ...(ctx && { contexts: ctx }),
    parentId: parentId,
    type: type,
    ...(type == 'checkbox' && { checked: true }),
    // ...(parentId && {parentId: parentId}),
    ...(_ws && { _ws: _ws })
  }
}

const create_empty_workspace_handler = () => {
  let aNewWorkSpace = {}
  const wsName = window.prompt("Please Enter a Name for your new WorkSpace")
  let menuComponent = genCtxMenuEntry({ _ws: ws.fromWindows([{ tabs: [] }], wsName, WS_MANAGER), ctx: null, parentId: null, withSubmenu: true })
  dynamicRootMenuWorkSpace.push(menuComponent)
  CTX_MENU.updateMenu()
  return aNewWorkSpace

}

const create_workspace_handler = async (info, tab, current=true) => {

  const wsName = window.prompt("Please Enter a Name for your new WorkSpace");
  let aNewWorkSpace = {}
  
  if (current) {
    console.log("creating WS from current window", CURRENT_WINDOW_ID )
    const win = await browser.windows.get(CURRENT_WINDOW_ID , { populate: true })  
    console.log(win)
    aNewWorkSpace = ws.fromWindows([win], wsName)
  } else {
    console.log("creating WS from ALL windows")
    const win = await browser.windows.getAll({ populate: true })
    aNewWorkSpace = ws.fromWindows(win, wsName)
  }

  WS_MANAGER.add(aNewWorkSpace)

  let menuComponent = genCtxMenuEntry({ _ws: aNewWorkSpace, ctx: null, parentId: null, withSubmenu: true })
  dynamicRootMenuWorkSpace.push(menuComponent)
  CTX_MENU.updateMenu()

  return aNewWorkSpace
}

const delete_workspace_handler = async (_id) => {
  console.log(`${ _id } Clicked`)

  const yesOrNo = window.prompt(`Are you Sure you want to DELETE "${_id}"? \nYes/No`).trim().toLowerCase()

  if (yesOrNo == 'yes') {
    
    await WS_MANAGER.remove(_id)
    await CTX_MENU.deleteMenu(_id)
    dynamicRootMenuWorkSpace = dynamicRootMenuWorkSpace.filter(m => m.id != _id)
    CTX_MENU.updateMenu()
    console.log('Deleting WS - ', _id)
  } else {
    console.log(_id, 'Not Deleted - "Yes" Comfirmation Not Entered')
  }
}

const CONTEXTS = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];

const WORKSPACEMENU = [
  {
    id: 'add_fn', title: 'Add this tab', act: (info, tab) => {
      WS_MANAGER.all[info.parentMenuItemId].add(tab.url, tab.title)

      dynamicRootMenuWorkSpace = dynamicRootMenuWorkSpace.map(m => {
        return m.id != info.parentMenuItemId ? m :
          {
            ...m,
            ...{ menu: generateUniqueSubMenu(WORKSPACEMENU, info.parentMenuItemId) }
          }
      })
      CTX_MENU.updateMenu()
    }
  },
  { id: 'remove_fn', title: 'Remove this tab', act: (info, tab) => { console.log('context Menu-> remove_fn', info, tab, info.menuItemId); alert('Clicked ItemG') } },
  {
    id: 'peek_fn', title: 'Peek',
    act: (info, tab) => { console.log('context Menu-> peek_fn', info, tab, info.menuItemId) },
    menu: []
  },
  {
    id: 'open_fn', title: 'Open', act: (info, tab) => {
      WS_MANAGER.all[info.parentMenuItemId].open()
      console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn')
    }
  }
  // {
  //   id: 'update_fn', title: 'Update', act: (info, tab) => {
  //     // WS_MANAGER.all[info.parentMenuItemId].update(urls)

  //     alert(`context Menu-> update_fn - ${JSON.stringify(tab,null, 2)}`,)

  //   }
  // }
];

const generateWSDeleteList = () => {
  let res = Object.keys(WS_MANAGER.all).map(wsName => {
    return {
      id: randomId(),
      name: wsName,
      title: wsName,
      act: (info, tab) => {
        delete_workspace_handler(wsName)
      }
    }
  }).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  return res
} 

// menu element need to have Unique IDs
const generateUniqueSubMenu = (m, parentName) => {
  const arr1 = WS_MANAGER.get(parentName).windows.map(x => x.tabs.map(t => { return { title: t.title, url: t.url } }))
  const arr2 = Array.from({ length: arr1.length - 1 }, () => '|')
  const arr3 = interleave(arr1, arr2).flat().map(x => {
    if (x == '|') {
      return [{
        type: "separator"
      }, {
        type: "separator"
      }]
    }
    return {
      id: randomId(),
      name: x.title,
      title: x.title,
      act: (info, tab) => { console.log('Opening URL - ', x.url) }
    }
  }).flat()

  // console.log(`generateUniqueSubMenu -> `, parentName, m)

  return m.map(item => {
    return {
      ...item,
      ...{ id: `${ item.id }_${ formatId(parentName) }` },
      ...(item.id == 'peek_fn' && {
        menu: arr3
        // menu: [{
        //   id: `${Math.random(1) + 100}`,
        //   title: `${Math.random(1) + 100}_${parentName}`,

        // }]
      }),
    }
  })
}

const OPTIONMENU = [
  { id: "focus_option", type: "checkbox", checked: false, title: "Focus ( Temporarily close other tabs )", act: (info, tab) => { console.log(info, tab) } },
  { id: "discard_option", type: "checkbox", checked: false, title: "Discard Tabs on Open", act: (info, tab) => { console.log(info, tab) } }
]

const CREATEWSMENU = [
  { id: 'create_workspace_empty', title: 'Empty Workspace', act: create_empty_workspace_handler },
  { id: 'create_workspace_from_all', title: 'From All Windows', act: (info, tab,)=> create_workspace_handler(info, tab, false) },
  { id: 'create_workspace_from_current', title: 'From Current Window', act: create_workspace_handler },
]

let DELETEMENU = [
  ...generateWSDeleteList(),
]

const ROOTMENU = [
  { id: 'create_workspace', title: 'Create WorkSpace', menu: CREATEWSMENU },
  { id: 'delete_workspace', title: 'Delete WorkSpace', menu: DELETEMENU},
  // { id: 'delete_workspace', title: 'Delete WorkSpace', act: delete_workspace_handler },
  { id: 'option', title: 'Options', menu: OPTIONMENU },
  { type: 'separator' },
];

const reloadSavedWS = () => {
  let res = []
  for (const [wsId, wsObj] of Object.entries(WS_MANAGER.all)) {
    res.push(genCtxMenuEntry({ _ws: wsObj, ctx: null, parentId: null, withSubmenu: true }))
  }

  if (res.length == 0) {
    res.push(
      genCtxMenuEntry({ _ws: ws.fromWindows([{ tabs: [] }], 'news', WS_MANAGER), ctx: null, parentId: null, withSubmenu: true }),
      genCtxMenuEntry({ _ws: ws.fromWindows([{ tabs: [] }], 'school', WS_MANAGER), ctx: null, parentId: null, withSubmenu: true }),
      genCtxMenuEntry({ _ws: ws.fromWindows([{ tabs: [] }], 'games', WS_MANAGER), ctx: null, parentId: null, withSubmenu: true })
    )
  }

  return res.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
}

let dynamicRootMenuWorkSpace = [
  ...reloadSavedWS(),
].sort(
  (a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)
)
window.dynamicRootMenuWorkSpace = dynamicRootMenuWorkSpace

export class ctxMenu {

  static listeners = {}
  static contexts = CONTEXTS

  static workSpaces = [];
  static rootMenu = [];

  constructor(entries = [], _rootMenu = []) {
    this._reset()

    ctxMenu.rootMenu = _rootMenu.length ? _rootMenu : ROOTMENU
    this.workSpaces = []
    // append existing ws to the rootMenu
    for (const w of entries) {
      this.workSpaces.push(w)
    }
    // create the chrome contextMenu from the rootMenu Array
    this.createMenu([...ctxMenu.rootMenu, ...this.workSpaces])
    this.setOnClickHandler()
  }

  _reset() {
    chrome.contextMenus.removeAll((data) => { console.log(`Ctx Menu -> Reset`) })
  }

  setOnClickHandler() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      ctxMenu.listeners[info.menuItemId](info, tab);
    });
  }

  removeOnClickHandler() {
    chrome.contextMenus.onClicked = null
  }

  createMenu(menu, root = null) {
    // console.log("createMenu ->", menu, root)

    for (let _m of menu) {
      let { id, title, menu, act, type, _ws } = _m

      if (id in ctxMenu.listeners) {
        // console.log(`create -> [Del] - exiting id: ${id}`)
        this.deleteMenu(id)
      }

      let __title = title && `${ _ws ? `⦿ ` : '' }${ formatName(title?.replace('⦿', '')) } ${ _ws ? `(${ _ws.tabCount })` : '' }`.trim()

      chrome.contextMenus.create(
        // ⦾
        (type == "separator") ? {
          type: "separator",
          parentId: root,
        } :
          genCtxMenuEntry({
            id: id,
            // ...(title && {title: `${ _ws ? `⦿ ` : '' }${formatName(title.replace('⦿', '').trim())} ${ _ws ? `(${ _ws.tabCount })` : '' }`.trim()}),
            ...(title && {title:  `${__title}`}),
            ctx: ctxMenu.contexts,
            parentId: root,
            act: false,
            _ws: false,
            type: type || 'normal'
          })
      );

      if (act) { ctxMenu.listeners[id] = act }
      if (menu) { this.createMenu(menu, id) }
    }
  }

  updateMenu(menu = [], root = null) {
    this._reset() // remove all so there is no ID issues

    const _menu = [...ROOTMENU,...dynamicRootMenuWorkSpace.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))]  // add all available menu
    _menu.find(x=>x.id=="delete_workspace").menu = [...generateWSDeleteList()] 
    this.createMenu(_menu)
  }

  deleteMenu(id) {
    if (id in ctxMenu.listeners) {
      // console.log(`Deleting ${id} - listener`)
      delete ctxMenu.listeners[id]
      chrome.contextMenus.remove(id, () => {
        if (chrome.runtime.lastError) {
          // console.log("error : ", chrome.runtime.lastError.message);
        }
        // console.log(`DELETED - context menu ws - ${ id }`)
      });
    }
  }
}


const listOfWorkSpaces = dynamicRootMenuWorkSpace
console.log(listOfWorkSpaces.map(i => i.title))

const CTX_MENU = new ctxMenu(listOfWorkSpaces, ROOTMENU)