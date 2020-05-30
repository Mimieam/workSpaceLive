// thanks to https://stackoverflow.com/a/50936590/623546
/**
 * Dynamic ws context menu
 * 
 */


// let listOfWorkSpaces = []

// const workSpaceMenu = [
//   { id: 'add_fn', title: 'Add', act: (info, tab) => { console.log('context Menu-> add_fn', info, tab, info.menuItemId); alert('Clicked ItemF') } },
//   { id: 'remove_fn', title: 'Remove', act: (info, tab) => { console.log('context Menu-> remove_fn', info, tab, info.menuItemId); alert('Clicked ItemG') } },
//   { id: 'peek_fn', title: 'Peek', act: (info, tab) => { console.log('context Menu-> peek_fn', info, tab, info.menuItemId); alert('context Menu-> peek_fn') } },
//   { id: 'open_fn', title: 'Open', act: (info, tab) => { console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn') } },
// ];


// let rootMenu = [
//   { id: 'create_workspace', title: 'Create WorkSpace', act: (info, tab) => { console.log('Clicked ItemE', info, tab, info.menuItemId); window.prompt("Please Enter a Name for your new WorkSpace");} },
//   { id: 'delete_workspace', title: 'Delete WorkSpace', act: (info, tab) => { console.log('Clicked ItemE', info, tab, info.menuItemId); window.prompt("Enter the name of a WorkSpace to DELETE"); } },
//   // { id: 'ItemA', act: (info, tab) => { console.log('Clicked ItemA', info, tab, info.menuItemId); alert('Clicked ItemA') }, menu: workSpaceMenu },
//   // { id: 'ItemC', act: (info, tab) => { console.log('Clicked ItemC', info, tab, info.menuItemId); alert('Clicked ItemC') } },
// ];

// const addNewWorkSpace = (id, title, cb=(info, tab)=>{ }) => {
//   return {
//     id: id,
//     title: title,
//     menu: workSpaceMenu,
//     act: (info, tab) => {
//       console.log(`contextMenu::addNewWorkSpace -> ${ id }`, info, tab, info.menuItemId);
//       cb(info, tab)
//     },
//   }
// }

// const appendWorkSpacesToRootMenu = (listOfWorkSpaces) => {
//   for (ws in listOfWorkSpaces) {
//     const { id, title} = ws
//     rootMenu.push(addNewWorkSpace(id, title))
//   }
// }



// const listeners = {};
// const contexts = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];

// const createMenu = (menu, root = null) => {
//   for (let item of menu) {
//     let { id, title, menu, act } = item;

//     chrome.contextMenus.create({
//       id: id,
//       title: id.split('_')[0],
//       contexts: contexts,
//       parentId: root
//     });

//     if (act) { listeners[id] = act; }
//     if (menu) { createMenu(menu, id); }
//   }
// };

// const deleteMenu = (id) => {
//   if (id in listeners) {
//     chrome.contextMenus.remove(id, () => { `DELETED - context menu - ${id}`});
//     delete listeners[id]
//   }
// }



// createMenu(rootMenu);


// let count = 0
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   console.log('Activate „chrome.contextMenus -> onClicked Listener“', info, tab);
//   // rootMenu.push({ id: 'ItemE'+count, act: (info, tab) => { console.log('Clicked ItemE'+count, info, tab, info.menuItemId); alert('Clicked ItemE'+count) } });
  
//   // chrome.contextMenus.create({
//   //   id: 'ItemE'+count,
//   //   title: 'ItemE'+count,
//   //   contexts: contexts,
//   //   parentId: null
//   // });
//   // count += 1;

//   listeners[info.menuItemId](info, tab);
// });
import WS_MANAGER, { ws, formatId, formatName } from './neoWorkSpace'
import browser from 'webextension-polyfill';


const create_workspace_handler = async (info, tab) => {
  // console.log(`${ info.menuItemId } Clicked`, info, tab, info.menuItemId)
  
  const wsName = window.prompt("Please Enter a Name for your new WorkSpace");
  const win = await browser.windows.getAll({ populate: true })  
  const aNewWorkSpace = ws.fromWindows(win, wsName)

  WS_MANAGER.add(aNewWorkSpace)
  const _id = formatId(aNewWorkSpace.name)
  const _name = formatName(aNewWorkSpace.name)

  let menuComponent = { id: _id,  title: _name, act: (info, tab) => { console.log(`Menu component ${_id}`) }, menu:  generateUniqueSubMenu(WORKSPACEMENU, _id), }
  // dynamicRootMenuWorkSpace.push(menuComponent)
  CTX_MENU.updateMenu([menuComponent])
  // console.log(CTX_MENU, dynamicRootMenuWorkSpace)
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
  // delete saved string

}

const CONTEXTS = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];



const WORKSPACEMENU = [
  { id: 'add_fn', title: 'Add this tab', act: (info, tab) => { console.log('context Menu-> add_fn', info, tab, info.menuItemId); alert(`CLicked ${info.menuItemId}`) } },
  { id: 'remove_fn', title: 'Remove this tab', act: (info, tab) => { console.log('context Menu-> remove_fn', info, tab, info.menuItemId); alert('Clicked ItemG') } },
  { id: 'peek_fn', title: 'Peek', act: (info, tab) => { console.log('context Menu-> peek_fn', info, tab, info.menuItemId); alert('context Menu-> peek_fn') } },
  { id: 'open_fn', title: 'Open', act: (info, tab) => { console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn') } },
];

const generateUniqueSubMenu = (m, parentName) => {
  // menu element need to have Unique IDs
  return m.map(item => { return { ...item, ...{ id: `${ item.id }_${ formatId(parentName) }` } } })
}

const ROOTMENU = [
  { id: 'create_workspace', title: 'Create WorkSpace', act: create_workspace_handler },
  { id: 'delete_workspace', title: 'Delete WorkSpace', act: delete_workspace_handler },
  { id: 'ws_1', title:'WS 1', act: (info, tab) => { console.log('Clicked WS_1', info, tab, info.menuItemId); alert('Clicked WS_1') }, menu: generateUniqueSubMenu(WORKSPACEMENU, 'WS_1') },
  { id: 'ws_2', title:'WS 2', act: (info, tab) => { console.log('Clicked WS_1', info, tab, info.menuItemId); alert('Clicked WS_1') }, menu: generateUniqueSubMenu(WORKSPACEMENU, 'WS_2') },
  { id: 'ws_3', title:'WS 3', act: (info, tab) => { console.log('Clicked WS_1', info, tab, info.menuItemId); alert('Clicked WS_1') }, menu: generateUniqueSubMenu(WORKSPACEMENU, 'WS_3') },
];

let dynamicRootMenuWorkSpace = [
  // { id: 'WS_1', act: (info, tab) => { console.log('Clicked WS_1', info, tab, info.menuItemId); alert('Clicked WS_1') }, menu: workSpaceMenu },
]

export class ctxMenu {

  static listeners = {}
  static contexts = CONTEXTS
  
  static workSpaceMenu = [];
  static rootMenu = [];

  constructor(listOfWorkSpaces = [], _wsMenu = [], _rootMenu = []) {
    this._reset()

    ctxMenu.rootMenu =  _rootMenu.length ? _rootMenu : ROOTMENU 
    ctxMenu.workSpaceMenu = _wsMenu.length ? _wsMenu : WORKSPACEMENU 

    // append existing ws to the rootMenu
    for (ws in listOfWorkSpaces) {
      const { id, name} = ws
      ctxMenu.rootMenu.push({
        id: id,
        title: name,
        menu: generateUniqueSubMenu(ctxMenu.workSpaceMenu, id),
        act: (info, tab) => {
          console.log(`contextMenu::addNewWorkSpace -> ${ id }`, info, tab);
        },
      })
    }
    // create the chrome contextMenu from the rootMenu Array
    this.createMenu(ctxMenu.rootMenu)
    this.setOnClickHandler()
  }

  _reset() {
    chrome.contextMenus.removeAll((data) => { console.log(`Ctx Menu -> Reset`) })
  }

  setOnClickHandler() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      // console.log('chrome.contextMenus -> onClicked Listener“', info, tab);
      ctxMenu.listeners[info.menuItemId](info, tab);
    });
  }

  removeOnClickHandler() {
    chrome.contextMenus.onClicked = null
  }

  createMenu (menu, root = null) {
    for (let item of menu) {
      let { id, title, menu, act } = item
      // console.log(id, title, menu)

      if (id in ctxMenu.listeners) {
        console.log(`create -> [Del] - exiting id: ${id}`)
        this.deleteMenu(id)
      } 

      chrome.contextMenus.create({
        id: id,
        title: title,
        contexts: ctxMenu.contexts,
        parentId: root
      });
        
      if (act) { ctxMenu.listeners[id] = act }
      if (menu) { this.createMenu(menu, id) }  
      
    }
  }

  updateMenu(menu=[], root = null) {
    // const _menu = [...ROOTMENU, ...dynamicRootMenuWorkSpace, ...menu]  // add all available menu
    // console.log(_menu)
    console.log(ctxMenu.rootMenu)
    this.createMenu(menu)
  }
  
  deleteMenu(id) {
    if (id in ctxMenu.listeners) {
      console.log(`Deleting ${id} - listener`)
      delete ctxMenu.listeners[id]
      chrome.contextMenus.remove(id, () => {
        if (chrome.runtime.lastError) {
          // console.log("error : ", chrome.runtime.lastError.message);
        }
        console.log(`DELETED - context menu ws - ${ id }`)
      });
    }
  }
}


const listOfWorkSpaces = []
const CTX_MENU = new ctxMenu(listOfWorkSpaces, WORKSPACEMENU, ROOTMENU)