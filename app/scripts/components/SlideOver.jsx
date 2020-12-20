import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faExclamationCircle, faBars } from '@fortawesome/free-solid-svg-icons'
import { timeout } from '../libs/utils'
import './SlideOver.css'
import Sidebar from './Sidebar'


export const SlideOver = (props) => {
    
    // const [isOpen, setIsOpen] = useState(false)
  const { isOpen, dismiss } = props
    
  const handleClick = ()=>{
    dismiss()
    console.log("isOpen =", isOpen)
  }
    
  return (
    <div className={`appSidebar ${isOpen == true ? 'show': 'hide'} fixed inset-0 overflow-hidden mt-10`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* <!--
          Background overlay, show/hide based on slide-over state.

          Entering: "ease-in-out duration-500"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-500"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 transition-opacity" aria-labelledby="slide-over-shadow" aria-hidden="true" onClick={handleClick}></div>
        <section className="absolute inset-y-0 right-0 flex" aria-labelledby="slide-over-heading">
          {/* <!--
            Slide-over panel, show/hide based on slide-over state.

            Entering: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-full"
              To: "translate-x-0"
            Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-0"
              To: "translate-x-full"
          --> */}
          <div className="relative w-screen max-w-md">
            {/* <!--
              Close button, show/hide based on slide-over state.

              Entering: "ease-in-out duration-500"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "ease-in-out duration-500"
                From: "opacity-100"
                To: "opacity-0"
            --> */}
            <div className="absolute top-0 right-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
              <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={handleClick}> 
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-full flex flex-col py-6 bg-gray-800 shadow-xl overflow-y-scroll">
              <div className="px-4 sm:px-6">
                <h2 id="slide-over-heading" className="text-lg font-medium text-gray-900">
                  Spaces { }
                </h2>
              </div>
              <div className="mt-6 relative flex-1 px-4 sm:px-6">
                {/* <!-- Replace with your content --> */}
                <div className="absolute inset-0 px-4 sm:px-6">
                  <div className="h-full border-2 border-dashed border-gray-200 p-1" aria-hidden="true">
                    <Sidebar />
                  </div>
                </div>
                {/* <!-- /End replace --> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
            
  )
}


export default SlideOver