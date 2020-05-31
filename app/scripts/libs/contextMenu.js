// thanks to https://stackoverflow.com/a/50936590/623546
/**
 * Dynamic ws context menu
 * 
 */

import WS_MANAGER, { ws, formatId, formatName } from './neoWorkSpace'
import browser from 'webextension-polyfill';



const genCtxMenuEntry = ({ _ws = {}, ctx=null, parentId=null, withSubmenu=false, id=null, title=null}) => {
// const genCtxMenuEntry = (_ws, ctx, parentId = null, withSubmenu = false) => {
  // console.log(_ws)
  const _id = formatId(_ws?.name || id)
  const _name = formatName(_ws?.name || title)

  return {
    id: _id,
    title: _name,
    act: (info, tab) => { console.log(`Menu component ${ _id }`) },
    ...(withSubmenu && { menu: generateUniqueSubMenu(WORKSPACEMENU, _id) }),
    ...(ctx && {contexts: ctx}),
    ...(parentId && {parentId: parentId}),
    ...(_ws && {_ws: _ws})
  }
}

const create_workspace_handler = async (info, tab) => {
  
  const wsName = window.prompt("Please Enter a Name for your new WorkSpace");
  const win = await browser.windows.getCurrent({ populate: true })  
  const aNewWorkSpace = ws.fromWindows([win], wsName)

  // const _id = formatId(aNewWorkSpace.name)
  // const _name = formatName(aNewWorkSpace.name)
  
  let menuComponent = genCtxMenuEntry({_ws: aNewWorkSpace, ctx:null, parentId:null, withSubmenu:true})
  dynamicRootMenuWorkSpace.push(menuComponent)
  
  WS_MANAGER.add(aNewWorkSpace)
  CTX_MENU.updateMenu()

  return aNewWorkSpace
}

const delete_workspace_handler = async (info, tab) => {
  console.log(`${ info.menuItemId } Clicked`)
  
  const wsName = window.prompt("Enter the name of a WorkSpace to DELETE")
  // delete context menu element
  // delete listener
  const _id = formatId(wsName)
  WS_MANAGER.remove(_id)
  CTX_MENU.deleteMenu(_id)
  dynamicRootMenuWorkSpace = dynamicRootMenuWorkSpace.filter( m => m.id != _id )
  // delete saved string
}

const CONTEXTS = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];

const WORKSPACEMENU = [
  {
    id: 'add_fn', title: 'Add this tab', act: (info, tab) => {
      console.log(WS_MANAGER, info, tab)
      WS_MANAGER.all[info.parentMenuItemId].add(info.pageUrl)
      CTX_MENU.updateMenu()
    }
  },
  { id: 'remove_fn', title: 'Remove this tab', act: (info, tab) => { console.log('context Menu-> remove_fn', info, tab, info.menuItemId); alert('Clicked ItemG') } },
  {
    id: 'peek_fn', title: 'Peek',
    act: (info, tab) => {
      console.log('context Menu-> peek_fn', info, tab, info.menuItemId); alert('context Menu-> peek_fn')
    },
    menu: [
      
    ]
  },
  { id: 'open_fn', title: 'Open', act: (info, tab) => { console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn') } },
];

// menu element need to have Unique IDs
const generateUniqueSubMenu = (m, parentName) => {
  // WS_MANAGER.
  return m.map(item => {
    return {
      ...item,
      ...{ id: `${ item.id }_${ formatId(parentName) }` },
      ...(item.id == 'peek_fn' && {
        menu: [{
          id: `${Math.random(1) + 100}`,
          title: `${Math.random(1) + 100}_${parentName}`,
      }] }),
    }
  })
}

const ROOTMENU = [
  { id: 'create_workspace', title: 'Create WorkSpace', act: create_workspace_handler },
  { id: 'delete_workspace', title: 'Delete WorkSpace', act: delete_workspace_handler },
];

let dynamicRootMenuWorkSpace = [
  // ws.fromWindows([{tabs:[]}], 'news'),
  // ws.fromWindows([{tabs:[]}], 'school'),  
  // ws.fromWindows([{ tabs: [] }], 'games'),
  genCtxMenuEntry({_ws: ws.fromWindows([{ tabs: [] }], 'news', WS_MANAGER), ctx: null, parentId:null, withSubmenu:true}),
  genCtxMenuEntry({_ws: ws.fromWindows([{ tabs: [] }], 'school', WS_MANAGER), ctx: null, parentId:null, withSubmenu:true}),
  genCtxMenuEntry({_ws: ws.fromWindows([{ tabs: [] }], 'games', WS_MANAGER), ctx: null, parentId:null, withSubmenu:true}),
  // { id: 'news', title:'news', act: (info, tab) => {}, menu: generateUniqueSubMenu(WORKSPACEMENU, 'news'), _ws: ws.fromWindows([{name:'news', tabs:[]}],'news', ) },
  // { id: 'school', title:'schoows.fromWindows([{ tabs: [] }], 'games')l', act: (info, tab) => {}, menu: generateUniqueSubMenu(WORKSPACEMENU, 'school'), _ws: ws.fromWindows([{name:'school', tabs:[]}],'school', ) },
  // { id: 'games', title:'games', act: (info, tab) => {}, menu: generateUniqueSubMenu(WORKSPACEMENU, 'games'), _ws: ws.fromWindows([{name:'games', tabs:[]}],'games', ) },
].sort(
  (a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)
)

export class ctxMenu {

  static listeners = {}
  static contexts = CONTEXTS
  
  static workSpaces = [];
  static rootMenu = [];

  constructor(entries = [], _rootMenu = []) {
    this._reset()

    ctxMenu.rootMenu =  _rootMenu.length ? _rootMenu : ROOTMENU 
    this.workSpaces = []
    // append existing ws to the rootMenu
    for (const w of entries) {
      // console.log(w)
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
    // console.log(menu)
    
    for (let _m of menu) {
      let { id, title, menu, act, _ws } = _m
      console.log(_m, `${formatName(title)} ${_ws?`(${_ws.tabCount})`:''}`)
      // let _ws_object = null
      // // let tabs = []
      // if (id in WS_MANAGER.all) {
      //   _ws_object = WS_MANAGER.all[id]
      //   console.log("_ws_object", _ws_object)
      // //   tabs = _ws_object.tabs || []
      // //   console.log('WS_MANAGER ==> ',_ws_object)
      // }

      if (id in ctxMenu.listeners) {
        // console.log(`create -> [Del] - exiting id: ${id}`)
        this.deleteMenu(id)
      }

      chrome.contextMenus.create(
        // genCtxMenuEntry({
        //   id: id,
        //   title: formatName(title),
        //   contexts: ctxMenu.contexts,
        //   parentId: root
        //   // ctx: null, parentId: null, withSubmenu: true
        // })
        {
        id: id,
        // title: `${formatName(title)}`,
        title: `${formatName(title)} ${_ws?`(${_ws.tabCount})`:''}`.trim(),
        contexts: ctxMenu.contexts,
        parentId: root
        }
      );
        
      if (act) { ctxMenu.listeners[id] = act }
      if (menu) { this.createMenu(menu, id) }
    }
  }

  updateMenu(menu = [], root = null) {
    const _menu = [...ROOTMENU, ...dynamicRootMenuWorkSpace.sort( (a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)) ]  // add all available menu

    console.log(_menu.map(m => m.title))
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