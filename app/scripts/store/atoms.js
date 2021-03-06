import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

//initial State
const initialStateMap = {
  tabs: [],
  element2: "defaultValue2",
  element3: "defaultValue3",
}

// create a list of atoms from the state
// {element1: {…}, element2: {…}, element3: {…}}

const createAtoms = (stateDictionary) => {
  const arrOfAtoms = Object
    .entries(stateDictionary)
    .map(([key, value]) => { return {[key]: atom({ key: key, default: value })} })

  return Object.assign({}, ...arrOfAtoms)
}

const initialState = createAtoms(initialStateMap)


export const tabState = atom({
  key: 'tabs',
  default: [],
});

export const initialTabState = atom({
  key: 'initialTabs',
  default: [],
});

export const isSearchingState = atom({
  key: 'isSearching',
  default: false,
});

export const sideBarState = atom({
  key: 'sideBarState',
  default: false,
});

export const popupWindowState = atom({
  key: 'popupWindow',
  default: [],
})
