import React, { useState, useEffect, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'
import Tab, { Tab_} from './Tab'
import useGlobal from './store';
import styled from '@emotion/styled';

import '../../styles/main.css'

export default function App() {
  const [state, setState] = useState([getItems(10), getItems(5, 10)]);
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    const fetchCurrentWindows = async () => {
      const windows = await browser.windows.getAll({ populate: true })
      const tabs = windows.map(w => w.tabs)
      console.log(windows)
      console.log(`tabs = ${ tabs }`, state, tabs)
      setState([...tabs, []])
    }

    fetchCurrentWindows();
    return () => { }
  }, []);


  function onDragEnd(result) {

    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      let sInd = +source.droppableId;
      let dInd = state.length
      let _newDestination = { index: 0, droppableId: `${ state.length }` }
      setState([...state, [] ])
      
      const result = move(state[sInd], [], source, _newDestination);
      const newState = [...state, [state[sInd][source.index]] ];
      result.destination = _newDestination
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      console.log(newState, [state[sInd][source.index]], dInd, result[dInd])
      setState(newState.filter(group => group.length));
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      console.log(sInd, state[sInd], source.index, source)

      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd]||[], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  }

  console.log(state)
  return (
    <div>
      <p>
        counter:
        { globalState.counter }
      </p>
      <div style={ { display: "flex", flexDirection: 'column' } }>
      {/* <div className="windowCard px-4 py-2 border-orange-800 bg-gray-200 border-solid border-r-4 rounded-lg my-2 mx-3 shadow-md"> */}
        {/* <div className="font-bold text-lg mb-2 border-solid border-gray-300 border-b-2 text-gray-800">Window ID = x </div> */}
        {/* <div className="text-gray-700 text-base h-32 WCard"> */}
        <DragDropContext onDragEnd={ onDragEnd }>
          { state.map((el, ind) => (
            <Droppable key={ ind } droppableId={ `${ ind }` }>
              { (provided, snapshot) => (
              <Fragment>
                  <div className={ "windowTitle" }>WindowTitle</div>  
                <div
                className={ "wrapper" + `${snapshot.isDraggingOver? ' isDragging':'' }` }
                ref={ provided.innerRef }
                // style={ getListStyle(snapshot.isDraggingOver) }
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
      
      
      {/* </div> */}
      </div>
    </div>
  );
}
