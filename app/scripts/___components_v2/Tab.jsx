import React, { useState, useEffect, Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'

import useGlobal from './store';

const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};

export const FavIcon = ({ url }) => {
  const _style = {
    background: `url(chrome://favicon/size/16@x2/${ url }) no-repeat center`,
    height: "16px",
    width: "16px",
  }
  return <div style={ _style }> </div>
}



export const Tab_ = ({ item, state, setState, index, ind }) => {

  const [globalState, globalActions] = useGlobal();
  const _style_wrapper = {
    height: '1em',
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    lineHeight: "1em",
  },
    _style_title = {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap"
    }

  return (
    <div style={ _style_wrapper }>
      <FavIcon url={ item.url } />
      <div style={ _style_title }>
        { item.title }
      </div>
      {/* <button
        type="button"
        onClick={ () => {
          const newState = [...state];
          newState[ind].splice(index, 1);
          setState(newState.filter(group => group.length)
          );
        } }
      >
        delete
    </button> */}
      <button type="button" onClick={ () => globalActions.addToCounter(1) }>
        +1 to global
      </button>
    </div>
  )
}

export const primaryButton = 0;

export const Tab = ({ item, state, setState, index, ind }) => {
  const onKeyDown = (event, snapshot) => {
    // already used
    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== keyCodes.enter) {
      return;
    }

    // we are using the event for selection
    event.preventDefault();

    performAction(event);
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  const onClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    performAction(event);
  };

  // Determines if the platform specific toggle selection in group key was used
  const wasToggleInSelectionGroupKeyUsed = (event ) => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event ) => event.shiftKey;

  const performAction = (event ) => {
    console.log(performAction)
    // const {
    //   task,
    //   toggleSelection,
    //   toggleSelectionInGroup,
    //   multiSelectTo,
    // } = props;

    // if (wasToggleInSelectionGroupKeyUsed(event)) {
    //   toggleSelectionInGroup(task.id);
    //   return;
    // }

    // if (wasMultiSelectKeyUsed(event)) {
    //   multiSelectTo(task.id);
    //   return;
    // }

    // toggleSelection(task.id);
  };

    return (
      <Draggable key={ item.id } draggableId={ `${ item.id }` } index={ index }>
        { (provided, snapshot) => {

          // console.log(provided, snapshot, getItemStyle( snapshot.isDragging, provided.draggableProps.style))
          return (
        <div
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
              style={ getItemStyle(snapshot.isDragging, provided.draggableProps.style) }
              onClick={onClick}
              onKeyDown={(event) =>
                onKeyDown(event, snapshot)
              }
        >
          <Tab_
            item={ item }
            index={ index }
            state={ state }
            setState={ setState }
            ind={ ind }
          />
        </div>
      )} }
    </Draggable>
    )
  }


export default Tab