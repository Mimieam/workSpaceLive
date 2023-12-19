/**
 * A WorkSpace is a collection of Windows & Tabs pertaining to a common subject or task
 *
 */
// import {localStorage} from '../libs/storage';

const windowToWS = (windowsArr, name='ws') => {
  const windows =  windowsArr.map( w => {
    const {height, width, top, left, id, tabs} = w
    return {
      id,
      bounds: {height, width, top, left},
      tabs: tabs.map(t=>{
          const {url, title, id, pinned} = t
          return {url, title, id, pinned}
      })
    }
  })

  const winCount = windows.length
  const tabCount = windowsArr.reduce((acc, w) => { return acc + w.tabs.length }, 0)

  return { name, windows, tabCount, winCount }
}

const _ws_structure = {
  name: '',
  windows: [{
    id: '',
    bounds: [],
    tabs: [{
      id:'',
      url:'',
      title: '',
      pinned: '',
      lastActive: '',
    }],
  }],
  tabCounts: '',
  winCounts: '',
  lastOpen: '',
}


export class WorkSpaceManager {

  constructor(name = 'ws') {
    // an array of workspace name
    this.name = `somanytabs_${name}`;
    this.wsArr = this.loadWorkSpace() || [];
    this.count = this.wsArr.length;
    console.log('All Workspaces', this.wsArr);
  }

  loadWorkSpace() {
    console.log('loading WS');
    const ws = localStorage.getItem(this.name);
    if (ws) return JSON.parse(ws);
    return [];
  }

  addWorkSpace(name, wsStr) {
    //wsStr = stringified and compressed ws data
    const arr = [name].concat(this.wsArr);
    this.wsArr = Array.from(new Set(arr)); // deduplicate
    this.count = this.wsArr.length;
    localStorage.setItem(name, wsStr);
    this.saveWorkSpace();
  }

  listAllWorkSpace() {
    const allWS = this.wsArr;
    return allWS;
  }

  openAWorkSpace(wsName) {
    if (wsName in this.wsArr) {
      localStorage.getItem(wsName);
    }
  }

  removeWorkSpace(nameToBeDeleted) {
    this.wsArr = this.wsArr.filter(n => n != nameToBeDeleted);
    this.count = this.wsArr.length;
    localStorage.removeItem(nameToBeDeleted);
    this.saveWorkSpace();
  }

  saveWorkSpace() {
    localStorage.setItem(this.name, JSON.stringify(this.wsArr));
  }

  deleteAllWorkSpace() {
    const allWS = this.wsArr;
    allWS.map(ws => localStorage.removeItem(ws));
    this.wsArr = [];
    this.count = 0;
    localStorage.removeItem(this.name);
  }

  pop() {
    // remove the last item added - for the recursive focus
    const wskey = this.wsArr[0];
    const ws = localStorage.getItem(wskey);
    this.removeWorkSpace(wskey);
    this.saveWorkSpace();
    return ws;
  }

}


const WSM = new WorkSpaceManager('WS');

export default WSM;
