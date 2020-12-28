import React, { useState, useEffect, Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import browser from 'webextension-polyfill';
import { getItems, reorder, getItemStyle,getListStyle ,move } from './helpers'


import useGlobal from './store';
import './tab.css'
import { ButtonStrip } from "./ButtonStrip";

export const FavIcon = ({url}) => {
  const _style = {
    // background: `url(${ url }) no-repeat center`,
    // add this if u gonna use the chrome cache.. but it will give u low quality  "content_security_policy": "img-src chrome://favicon;"
    // background: `url(chrome://favicon/size/16@x2/${ url }) no-repeat center`,
    height: "16px",
    width: "16px",
    padding: "10px",
    marginLeft: "5px",

    backgroundImage: `url(${ url })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }
  return <div style={ _style }> </div>
}

export const Tab_ = ({ item, index, ind, favIconUrl }) => {

  const [globalState, globalActions] = useGlobal();
  const _style_wrapper = {
    display: "flex",
    fontSize: "13px",
    alignItems: "center",
  },
  _style_title = {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginLeft: "10px",
    maxWidth: "65%",
  },
  _style_buttons = {
    marginLeft: "auto" ,
  }

  // const _favUrl = item.favIconUrl
  // console.log(_favUrl)
        // { item.title }
  return (
    <div style={ _style_wrapper }>
      <FavIcon url={ favIconUrl } />
      {/* <FavIcon url={ item.url } /> */}
      <div style={ _style_title }>
        { `${item.id}|${item.index}`} { item.title }
      </div>

      <ButtonStrip item={item}/>
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


export const Tab = ({ item, index, ind, favIconUrl }) => {
  console.log(item, favIconUrl)
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
            ind={ ind }
            favIconUrl={ favIconUrl }
          />
        </div>
      )} }
    </Draggable>
    )
  }


export default Tab
