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

const create_workspace_handler = (info, tab) => {
  console.log(`${info.menuItemId} Clicked`, info, tab, info.menuItemId)
  let wsName = window.prompt("Please Enter a Name for your new WorkSpace");
  // getCurentWindow 
  
}

const CONTEXTS = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];

const WORKSPACEMENU = [
  { id: 'add_fn', title: 'Add', act: (info, tab) => { console.log('context Menu-> add_fn', info, tab, info.menuItemId); alert('Clicked ItemF') } },
  { id: 'remove_fn', title: 'Remove', act: (info, tab) => { console.log('context Menu-> remove_fn', info, tab, info.menuItemId); alert('Clicked ItemG') } },
  { id: 'peek_fn', title: 'Peek', act: (info, tab) => { console.log('context Menu-> peek_fn', info, tab, info.menuItemId); alert('context Menu-> peek_fn') } },
  { id: 'open_fn', title: 'Open', act: (info, tab) => { console.log('context Menu-> open_fn', info, tab, info.menuItemId); alert('context Menu-> open_fn') } },
];

const ROOTMENU = [
  { id: 'create_workspace', title: 'Create WorkSpace', act: (info, tab) => { console.log('Clicked ItemE', info, tab, info.menuItemId); window.prompt("Please Enter a Name for your new WorkSpace");} },
  { id: 'delete_workspace', title: 'Delete WorkSpace', act: (info, tab) => { console.log('Clicked ItemE', info, tab, info.menuItemId); window.prompt("Enter the name of a WorkSpace to DELETE"); } },
];

export class ctxMenu {

  static listeners = {}
  static contexts = CONTEXTS
  
  static workSpaceMenu = [];
  static rootMenu = [];

  constructor(listOfWorkSpaces = [], _wsMenu = [], _rootMenu = []) {
    ctxMenu.workSpaceMenu = _wsMenu.length ? _wsMenu : WORKSPACEMENU 
    ctxMenu.rootMenu =  _rootMenu.length ? _rootMenu : ROOTMENU 

    // append existing ws to the rootMenu
    for (ws in listOfWorkSpaces) {
      const { id, title} = ws
      ctxMenu.rootMenu.push({
        id: id,
        title: title,
        menu: ctxMenu.workSpaceMenu,
        act: (info, tab) => {
          console.log(`contextMenu::addNewWorkSpace -> ${ id }`, info, tab);
        },
      })
    }
    // create the chrome contextMenu from the rootMenu Array
    this.createMenu(ctxMenu.rootMenu)
    this.setOnClickHandler()
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
      let { id, title, menu, act } = item;
  
        if (id in ctxMenu.listeners) {
          this.deleteMenu(id)
        } 
        chrome.contextMenus.create({
          id: id,
          title: title,
          contexts: ctxMenu.contexts,
          parentId: root
        });
        
        if (act) { ctxMenu.listeners[id] = act; }
        if (menu) { this.createMenu(menu, id); }   
    }
  };
  
  deleteMenu(id) {
    if (id in ctxMenu.listeners) {
      chrome.contextMenus.remove(id, () => { `DELETED - context menu - ${id}`});
      delete ctxMenu.listeners[id]
    }
  }

}

const menu = new ctxMenu()