// thanks to https://stackoverflow.com/a/50936590/623546
/**
 * Dynamic ws context menu
 * 
 */

import WS_MANAGER, { ws, formatId, formatName } from './neoWorkSpace'
import browser from 'webextension-polyfill';
import { randomId } from './helpers'

window.WS_MANAGER = WS_MANAGER

const interleave = ([x, ...xs], ys = []) =>
  x === undefined
    ? ys                             // base: no x
    : [x, ...interleave(ys, xs)]  // inductive: some x

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

const create_workspace_handler = async (info, tab) => {

  const wsName = window.prompt("Please Enter a Name for your new WorkSpace");
  // const win = await browser.windows.getLastFocused({ populate: true })  
  // const aNewWorkSpace = ws.fromWindows([win], wsName)
  const win = await browser.windows.getAll({ populate: true })
  const aNewWorkSpace = ws.fromWindows(win, wsName)

  WS_MANAGER.add(aNewWorkSpace)

  // const _id = formatId(aNewWorkSpace.name)
  // const _name = formatName(aNewWorkSpace.name)

  let menuComponent = genCtxMenuEntry({ _ws: aNewWorkSpace, ctx: null, parentId: null, withSubmenu: true })
  dynamicRootMenuWorkSpace.push(menuComponent)
  console.log(dynamicRootMenuWorkSpace)

  CTX_MENU.updateMenu()

  return aNewWorkSpace
}

const delete_workspace_handler = (info, tab) => {
  console.log(`${ info.menuItemId } Clicked`)

  const wsName = window.prompt("Enter the name of a WorkSpace to DELETE")
  // delete context menu element
  // delete listener
  const _id = formatId(wsName)
  WS_MANAGER.remove(_id)
  CTX_MENU.deleteMenu(_id)
  dynamicRootMenuWorkSpace = dynamicRootMenuWorkSpace.filter(m => m.id != _id)
  // delete saved string
}

const CONTEXTS = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];

const WORKSPACEMENU = [
  {
    id: 'add_fn', title: 'Add this tab', act: (info, tab) => {
      WS_MANAGER.all[info.parentMenuItemId].add(info.pageUrl)

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
      // openTab({urls:[]})
      console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn')
    }
  },
];

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

  console.log(`generateUniqueSubMenu -> `, parentName, m)

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

const ROOTMENU = [
  { id: 'create_workspace', title: 'Create WorkSpace', act: create_workspace_handler },
  { id: 'delete_workspace', title: 'Delete WorkSpace', act: delete_workspace_handler },
  { id: 'option', title: 'Options', menu: OPTIONMENU },
  { type: 'separator' },
];

const reloadSavedWS = () => {
  let res = []
  for (const [wsId, wsObj] of Object.entries(WS_MANAGER.all)) {
    console.log(wsId, wsObj)
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
    console.log("createMenu ->", menu, root)

    for (let _m of menu) {
      let { id, title, menu, act, type, _ws } = _m

      if (id in ctxMenu.listeners) {
        // console.log(`create -> [Del] - exiting id: ${id}`)
        this.deleteMenu(id)
      }

      chrome.contextMenus.create(

        (type == "separator") ? {
          type: "separator",
          parentId: root,
        } :
          genCtxMenuEntry({
            id: id,
            ...(title && { title: `${ formatName(title) } ${ _ws ? `(${ _ws.tabCount })` : '' }`.trim() }),
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

    const _menu = [...ROOTMENU, ...dynamicRootMenuWorkSpace.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))]  // add all available menu

    console.log("UpdateMenu->", _menu.map(m => m.title))
    // console.log(_menu.map(m => m.title))
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