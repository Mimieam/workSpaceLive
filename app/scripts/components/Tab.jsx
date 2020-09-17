import React, { useState, useEffect, Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faThumbtack, faWindowClose } from '@fortawesome/free-solid-svg-icons'


import useGlobal from './store';
import './tab.css'

export const FavIcon = ({ url }) => {
  const _style = {
    background: `url(chrome://favicon/size/16@x2/${ url }) no-repeat center`,
    height: "16px",
    width: "16px",
    marginLeft: "5px",
  }
  return <div style={ _style }> </div>
}
const ButtonStrip = (props) => {
  const _style = {
    marginLeft: "auto",
    // width: "5em",
    display: "flex",
    justifyContent: "space-between",
  }

  const _fa_extra = {
    filter: "drop-shadow(0 0 2px #000)"
  }

  return (
    <div
      style={ _style }
    >
      <div className={"square_btn"}>
        <FontAwesomeIcon icon={faThumbtack} size="lg"/>
      </div>
      <div className={"square_btn"}>
      <FontAwesomeIcon icon={faClone} size="lg"/>
      </div>
      <div className={"square_btn"}>
      <FontAwesomeIcon icon={faWindowClose} size="lg"/>
      </div>
    </div>
  )
}
export const Tab_ = ({ item, state, setState, index, ind }) => {

  const [globalState, globalActions] = useGlobal();
  const _style_wrapper = {
    display: "flex",
    fontSize: "13px",
  },
  _style_title = {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginLeft: "15px",
    maxWidth: "65%",
  },
  _style_buttons = {
    marginLeft: "auto" ,
  }

  return (
    <div style={ _style_wrapper }>
      <FavIcon url={ item.url } />
      <div style={ _style_title }>
        { `${item.id}|${item.index}`} { item.title }
      </div>

      <ButtonStrip/>
      {/* <button
        style={_style_buttons}
        type="button"
        onClick={ () => globalActions.addToCounter(1) }
      >
        +1 to global
      </button> */}
    </div>
  )
}


export const Tab = ({ item, state, setState, index, ind }) => {
    return (
      <Draggable key={ item.id } draggableId={ `${ item.id }` } index={ index }>
        { (provided, snapshot) => {

          return (
        <div
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
          className={ "tab" + `${snapshot.isDragging? ' isDragging':'' }` }
          // style={ getItemStyle(snapshot.isDragging, provided.draggableProps.style) }
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