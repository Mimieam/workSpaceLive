import React, { useState } from 'react';
import Fuse from 'fuse.js'
import { tabState, initialTabState, isSearchingState } from '../store/atoms'
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

var fuse_options = {
    keys: [{
        name: 'title',
        weight: 0.8
    }, {
        name: 'url',
        weight: 0.2
    }],
    shouldSort: true,
    caseSensitive: false,
    // tokenize: true,
    // matchAllTokens: true,
    threshold: 0.3,
};

const nFuse = new Fuse([], fuse_options)
const searchStack = []

export const SearchBar = (props) => {

  const {state, setState}= props
  // const [state, setState] = useRecoilState(tabState);
  const [fetchedTabs, setFetchedTabs] = useRecoilState(initialTabState);
  const [isSearching, setIsSearching] = useRecoilState(isSearchingState);

  nFuse.setCollection(state)

  const onSearch = (event)=>{
    let {currentTarget} = event
    const targetValue = currentTarget.value

    if (!targetValue) {
        setIsSearching(false)
        return setState(fetchedTabs)
    }

    setIsSearching(true)

    // here we are searching each window... we could do it all at once by flattening ... but NOPE it screws up the display!
    let searchRes = []
    let _res;

    // arr = arr of tabs
    fetchedTabs.map( arr => {
      nFuse.setCollection(arr)
      let _res = nFuse.search(targetValue).map(x => x.item)
      _res.length ? searchRes.push(_res) : ''
    })

    setState(searchRes)

  }

  return (
    <div className="flex items-center justify-end pr-2">
        <div className="relative text-gray-600 focus-within:text-gray-300">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button type="submit" className="p-1 focus:outline-none text-base">
              <FontAwesomeIcon icon={faSearch} size="1x" />
            </button>
          </span>
          <input
            type="search"
            name="q"
            className="py-2 text-sm font-normal bg-gray-800 text-base text-gray-600 focus-within:text-gray-300 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900 focus:shadow-outline"
            placeholder="Search..."
            autoComplete="off"
            onChange={onSearch}
             />
        </div>
    </div>
  )
}

export default SearchBar
