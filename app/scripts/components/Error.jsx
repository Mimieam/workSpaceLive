import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { timeout } from '../libs/utils'



export const ErrorHook = (props) => {
  const {delay, message, dismiss} = props;

  useEffect(()=>{
    (async () =>{
        const timer = setTimeout(()=>{dismiss()}, delay)
        return () => {
            clearTimeout(timer)
        }
    })()
    }, [])

  const handleClick = ()=>{
    dismiss()
  }

return (
   // showError &&
  <div className="flex text-white px-6 py-4 border-0 rounded mb-4 bg-red-500 text-base fixed right-0 mr-2 mt-5 font-light w-9/12">
    <span className="text-xl inline-block mr-5 align-middle">
      <FontAwesomeIcon icon={faExclamationCircle} size="1x" />
    </span>
    <span className="flex flex-col align-middle">
      <span className="mb-1">
        <b className="capitalize right-0">Oops...</b>
      </span>
      <span>
        {/* <b className="capitalize">Hmm..!</b> */}
        { props.message }
      </span>
    </span>
    <button
      className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faTimes} size="xs" />
    </button>
  </div>
  )
}
