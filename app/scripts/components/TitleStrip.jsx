import React, { Component, useState, useEffect, Fragment } from "react";


export const TitleStrip = (props) => {
  const [liveMode, setLiveMode] = useState(props.liveMode || false)
  const toggle = () => {
    setLiveMode(!liveMode)
    console.log("TOGGLED")
  }
  return (
    <div className={'flex flex-col'}> <div>WorkSpace<span className={`text-teal-400  ${liveMode == true ? 'font-extrabold': ''}`}>{'{Live}'}</span></div>
      {/* <span className={ "text-teal-400 text-lg" } onClick={ () => toggle() }>S</span> */}
    </div>
  )
}


export default TitleStrip;