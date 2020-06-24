import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'
import Tab, { Tab_} from './Tab'
import useGlobal from './store';
import styled from '@emotion/styled';

import TaskApp from './TaskApp'


import '../../styles/main.css'

// const List = styled.div`
//   border: 1px solid orange;
//   margin: 2px;
//   text-align: center;
//   padding-bottom: 2px;
// `;

// const Bin = styled(List)`
//   border-color: teal;
// `;

// const Tasks = styled(List)``;

// const ListTitle = styled.h3`
//   padding: 2px;
//   width: 250px;
// `;

// function renderTasks(
//   tasks = [],
//   options = { isDragEnabled: true },
//   provided = {},
// snapshot = {}
// ) {
//   return tasks.map((item, index) => {

//           return( <Tab
//            key={ item.id }
//            item={ item }
//            index={ index }
//            provided={provided }
//            snapshot={ snapshot}
//          />)
//   });
// }

export default function App() {
  const [isShowingBin, setIsShowingBin] = useState(false);
  const [state, setState] = useState([getItems(10), getItems(5, 10)]);
  const [globalState, globalActions] = useGlobal();
  const [trash, setTrash] = useState([]);

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

  function onBeforeCapture() {
    setIsShowingBin(true);
  }

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

      // console.log(destination.droppableId === `${ state.length }`)
      // if (+destination.droppableId === state.length) {
      //   setTrash([...trash ,...result[dInd]])
      // } else {
      //   newState[dInd] = result[dInd];
      // }

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
      <button
        type="button"
        onClick={() => { setState([...state, []]) }}
      >
        New Window
      </button>
      {/* <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </button> */}
      <div style={ { display: "flex", flexDirection: 'column' } }>
        <DragDropContext onDragEnd={ onDragEnd } onBeforeCapture={ onBeforeCapture }>
          { state.map((el, ind) => (
            <Droppable key={ ind } droppableId={ `${ ind }` }>
              { (provided, snapshot) => (
                <div
                  ref={ provided.innerRef }
                  style={ getListStyle(snapshot.isDraggingOver) }
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
              ) }
            </Droppable>
          )) }
          {/* {isShowingBin ? (
            <Bin>
              <ListTitle>
                Trash{' '}
                <span role="img" aria-label="trash">
                  🗑
                </span>
              </ListTitle>
              <Droppable key={ state.length } droppableId={`${ state.length }`}>
                {
                  (provided, snapshot) => {
                    console.log("state = ",state)
                    return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {renderTasks(trash, { isDragEnabled: false }, provided, snapshot)}
                    {provided.placeholder}
                  </div>
                )}}
              </Droppable>
            </Bin>
          ) : null} */}
        </DragDropContext>
        <TaskApp/>
      </div>
    </div>
  );
}
