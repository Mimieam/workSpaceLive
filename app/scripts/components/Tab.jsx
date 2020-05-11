import React, { useState, useEffect, Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'

import useGlobal from './store';



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



export const Tab = ({ item, state, setState, index, ind }) => {

    return (
      <Draggable key={ item.id } draggableId={ `${ item.id }` } index={ index }>
        { (provided, snapshot) => {

          // console.log(provided, snapshot, getItemStyle( snapshot.isDragging, provided.draggableProps.style))
          return (
        <div
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
          style={ getItemStyle( snapshot.isDragging, provided.draggableProps.style) }
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