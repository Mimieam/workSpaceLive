
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faThumbtack, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { ChromeRPC } from "../libs/utils";

import { port } from "../libs/onMessageHook";



const onClickPinToggle = (tabId) => { 
  return port.postMessage({ TOGGLE_PIN: `${ tabId }`})
}
const onClickBringForward = (windowId, tabIndex) => {
  return port.postMessage({ BRING_FORWARD: `${ windowId },${ tabIndex}`})
  // return ChromeRPC.sendMessage({ BRING_FORWARD: `${ windowId },${ tabIndex}`}, (data) => console.log(data))
}
const onClickClose = (tabId, windowId) => {
  return port.postMessage({ CLOSE_TAB: `${ tabId },${ windowId }`})
  // return ChromeRPC.sendMessage({ CLOSE_TAB: `${ tabId },${ windowId }`}, (data) => console.log(data))
}


export const ButtonStrip = (props) => {
  const { item } = props
  const _style = {
    marginLeft: "auto",
    display: "flex",
    justifyContent: "space-between",
  }

  return (
    <div style={ _style }>
      <div className={"square_btn"} onClick={()=>onClickPinToggle(item.id, item.windowId)}>
        <FontAwesomeIcon icon={faThumbtack} size="lg"/>
      </div>
      <div className={"square_btn"} onClick={()=>onClickBringForward(item.windowId, item.index)}>
      <FontAwesomeIcon icon={faClone} size="lg"/>
      </div>
      <div className={"square_btn"} onClick={()=>onClickClose(item.id, item.windowId)}>
      <FontAwesomeIcon icon={faWindowClose} size="lg"/>
      </div>
    </div>
  )
}