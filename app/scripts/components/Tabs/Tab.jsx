import React, { Component } from 'react';


export const Tab = props => {
  const { className , label, onClick, isActive} = props
  let _className = className ? className : ''
  _className = isActive ? _className + ' tab-list-active' : ''
  
  return (
    <div key={ props.key } className={`${_className} tab-list-item`} onClick={ props.onClick }>
      { props.value }
    </div>
  )
}
