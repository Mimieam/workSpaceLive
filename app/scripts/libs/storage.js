
//slight modification of https://stackoverflow.com/a/70708120/623546
export const localStorage = {
    getAllItems: () => chrome.storage.sync.get(),
    getItem: async key => (await chrome.storage.sync.get(key))[key],
    setItem: (key, val) => chrome.storage.sync.set({[key]: val}),
    removeItems: (keys) => chrome.storage.sync.remove(keys),
  };
  globalThis.localStorage = localStorage
  console.warn('localStorage', localStorage)