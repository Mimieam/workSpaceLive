import React, { Component, useState, useEffect, Fragment } from "react";
import browser from 'webextension-polyfill';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil'

import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'
import Tab, { Tab_} from './Tab'
import useGlobal from './store';
// import styled from '@emotion/styled';
import Sidebar from './Sidebar'

// import '../../styles/main.css'
import { ChromeRPC } from "../libs/utils";
import { port, useChromeMessagePassing } from '../libs/onMessageHook'

import { NanoFuzz, nFuse } from './searchTab'


export default function App() {
  const [state, setState] = useState([]);
  const [globalState, globalActions] = useGlobal();

  useChromeMessagePassing(setState)

  useEffect(() => {
    const fetchCurrentWindows = async () => {
      const windows = await browser.windows.getAll({ populate: true })
      const tabs = windows.map(w => w.tabs)
      setState([...tabs, []])
    }

    fetchCurrentWindows();
    return () => { }
  }, []);

  const format = (state, sInd, dInd, source, destination) => {
    const sourceTabId = state[sInd][source.index]?.id
    const sourceTabIndex = source.index
    const destinationWindowId = state[dInd]? state[dInd][0]?.windowId: ''
    const destinationTabIndex = destination?.index

    port.postMessage({ MOVE_TAB: `${ sourceTabId }, ${ sourceTabIndex }, ${ destinationWindowId }, ${ destinationTabIndex }` })
    // ChromeRPC.sendMessage({ MOVE_TAB: `${ sourceTabId }, ${ sourceTabIndex }, ${ destinationWindowId }, ${ destinationTabIndex }` },
    //   (data) => {
    //     console.log(data)
    //   }
    // )
    // console.log(sourceTabId, sourceTabIndex, destinationWindowId, destinationTabIndex)
  }


  function onDragEnd(result) {
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

      console.log(newState, [state[sInd][source.index]], dInd, result[dInd])
      setState(newState.filter(group => group?.length));
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
      console.log(newState)

      setState(newState.filter(group => group?.length));

    } else {
      // const result = move(state[sInd], state[dInd], source, destination);
      const result = move(state[sInd], state[dInd]||[], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group?.length));
    }
    format(state, sInd, dInd, source, destination)
  }

  // remove the empty spot used to initialize the state and the
  // const _state = state.filter(w=>w.length).filter(w=>!(w[0].url == `chrome-extension://${browser.runtime.id}/popup.html`))
  console.log("App state: ", state)
  // console.log("filtered App state: ", _state)
  return (
    <div>
      {/* <Sidebar/> */}
      <div>
        WorkSpaceLive
        { globalState.counter }
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
      </div>
    </div>
  );
}
