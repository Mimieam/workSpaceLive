import React, { Component, useState, useEffect, Fragment } from "react";
import browser from 'webextension-polyfill';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState , useSetRecoilState, useRecoilValue} from 'recoil'

import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'
import Tab, { Tab_} from './Tab'
import useGlobal from './store';
// import styled from '@emotion/styled';
import Sidebar from './Sidebar'
import { tabState, initialTabState, isSearchingState } from '../store/atoms'

// import '../../styles/main.css'
import { ChromeRPC } from "../libs/utils";
import { port, useChromeMessagePassing } from '../libs/onMessageHook'

// import { NanoFuzz, nFuse } from './searchTab'
import {SearchBar} from './Search'
import {ErrorHook} from './Error'

let reload = 0
export default function App() {
  reload += 1
  const [state, setState] = useState([]);
  const [warning, setWarning] = useState("");
  const [error, setError] = useState(null);

  const [fetchedTabs, setFetchedTabs] = useRecoilState(initialTabState);
  const [isSearching, setIsSearching] = useRecoilState(isSearchingState);
/*
BUG: https://github.com/facebookexperimental/Recoil/issues/496
https://github.com/facebookexperimental/Recoil/issues/307
  const [state, setState] = useState([]);     VS   const [state, setState] = useRecoilState(tabState);
recoilJS causes a double rendering leading to layout shifts with React Beautify DnD which makes the animation terrible
until that's solved, we can either pass the state to the child components or use this Global hook work around... not a fan of either solutions..
*/

  const triggerError = (msg) =>{
    setError(msg)


    return
  }

  console.log('App - reloaded?? - ' , reload, state)



  useChromeMessagePassing(setState, setFetchedTabs)

  useEffect(() => {
    // console.log('Use effect-?')
    const fetchCurrentWindows = async () => {
      const windows = await browser.windows.getAll({ populate: true })
      const tabs = windows.map(w => w.tabs)
      setFetchedTabs(tabs)
      console.log("fetchedTabs 0", fetchedTabs)
      await setState([...tabs, []])
      // setRState(tabs)
    }
    console.log("fetchedTabs 1", fetchedTabs)

    fetchCurrentWindows();
    console.log("fetchedTabs 2", fetchedTabs)
    return () => { }
  }, []);

  const format = (state, sInd, dInd, source, destination) => {
    const sourceTabId = state[sInd][source.index]?.id
    const sourceTabIndex = source.index
    const destinationWindowId = state[dInd]? state[dInd][0]?.windowId: ''
    const destinationTabIndex = destination?.index

    if (!isSearching){
      port.postMessage({ MOVE_TAB: `${ sourceTabId }, ${ sourceTabIndex }, ${ destinationWindowId }, ${ destinationTabIndex }` })
      console.log("MOVE_TAB")

    } else {
      console.log('CANT move tab while searching... indexes aren\'t the same...', { MOVE_TAB: `${ sourceTabId }, ${ sourceTabIndex }, ${ destinationWindowId }, ${ destinationTabIndex }` })
      // const sourceTabId = state[sInd][source.index]?.id
      // const destinationWindowId = state[dInd]? state[dInd][0]?.windowId: ''
      const trueSourceTabIndex = state[sInd][sourceTabIndex]?.index
      const trueDestinationTabIndex = state[dInd][destinationTabIndex]?.index

      console.log('trying to ... anyway...', { MOVE_TAB_2: `${ sourceTabId }, ${ trueSourceTabIndex }, ${ destinationWindowId }, ${ trueDestinationTabIndex }`})
      triggerError("Can't currently move tabs while also searching.")
      // port.postMessage({ MOVE_TAB: `${ sourceTabId }, ${ trueSourceTabIndex }, ${ destinationWindowId }, ${ trueDestinationTabIndex }`})
    }
    // ChromeRPC.sendMessage({ MOVE_TAB: `${ sourceTabId }, ${ sourceTabIndex }, ${ destinationWindowId }, ${ destinationTabIndex }` },
    //   (data) => {
    //     console.log(data)
    //   }
    // )
    // console.log(sourceTabId, sourceTabIndex, destinationWindowId, destinationTabIndex)
  }


  async function onDragEnd(result) {
    // state = state.filter(w=>w.length)
    const { source, destination } = result;
    console.log(source, destination)
    // dropped outside the list
    if (!destination) {
      let sInd = +source.droppableId;
      let dInd = state.length
      let _newDestination = { index: 0, droppableId: `${ state.length }` }
      // setState([...state, [] ])

      const result = move(state[sInd], [], source, _newDestination);
      const newState = [...state, [state[sInd][source.index]] ];
      result.destination = _newDestination
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      // console.log(newState, [state[sInd][source.index]], dInd, result[dInd])
      await setState(newState.filter(group => group?.length));
      // setRState(state)
      format(state, sInd, dInd, source, destination)
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      console.log('reOrder', sInd, state[sInd], source.index, source)
      // console.log(newState)

      await setState(newState.filter(group => group?.length));
      // console.log(state===newState)
      // setRState(newState.filter(group => group?.length))

    } else {
      // const result = move(state[sInd], state[dInd], source, destination);
      const result = move(state[sInd], state[dInd]||[], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      await setState(newState.filter(group => group?.length));
      // setRState(state)
    }
    format(state, sInd, dInd, source, destination)
  }

  return (
    <div className={"appWrapper"}>
      {/* <Sidebar/> */}
      <div className="appHeader pt-2 pb-2 rounded-b bg-gray-900">
        <div className=" font-light text-base pl-4 pt-2"> WorkSpaceLive </div>
        <SearchBar
          state={state}
          setState={setState}
         />
      </div>
      <div className={ "windowColumn" } style={ { display: "flex", flexDirection: 'column' } }>
        <DragDropContext onDragEnd={ onDragEnd }>
          { state.map((el, ind) => (
          // { state.filter(w => w.length && w[0]?.title!="WorkspaceLive").map((el, ind) => (
            <Droppable key={ ind } droppableId={ `${ind}` }>
              { (provided, snapshot) => (
              <Fragment>
                  {/* <div className={ "windowTitle" }> WindowTitle { `${el[0]?.windowId}`} </div>   */}
                <div className={ "windowTitle" }>  { `${el?.length}`} Tabs </div>
                <div
                  className={ "wrapper resizeThis" + `${snapshot.isDraggingOver? ' isDragging':'' }` }
                  ref={ provided.innerRef }
                  { ...provided.droppableProps }
                >
                  { el.map((item, index) => (
                    <Tab
                    key={ item.id }
                    item={ item }
                    index={ index }
                    provided={provided }
                    snapshot={ snapshot}
                    />
                    )) }
                    { provided.placeholder }
                </div>
              </Fragment>
              ) }
            </Droppable>
          )) }
        </DragDropContext>
         { error && <ErrorHook
                     delay={2000}
                     message={error}
                     dismiss={()=>setError(null)}
                   />
          }
        </div>
    </div>
  );
}


// document.addEventListener("mouseover", ()=>{
//   // port.postMessage({ BRING_FORWARD: `${ windowId },${ tabIndex}`})
//   console.log("mouseover")
// })
