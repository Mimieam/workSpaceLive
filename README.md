# workSpaceLive

  Create Open/Save workSpaces - in multiple contexts

    a WorkeSpace ==> DragDropContext
        a Window ==> Droppable
           a Tab ==> Draggable

## [~ Functionalities ~]
  - context Menu - 
      + add an open Tab to a WS 
  - dragg and drop, sortable Tabs ( manually )
  - list multiple available WS
  - create a new WS from the current open windows
  - save a new WS 
  - create a button to enable/disable live Mode
  - live mode - mirror anything happening Window <=> Extention
      + in live Mode - delete_tab => closes the tab

  - Tab - Buttons:
      + could have a drop down with a few options to deal with Tabs
          - send to window X 
          - close -> delete_tab remove it from the Window ( auto update the WS)
          - open - bring in focus if Exist or Open a new Tab in the current Window

  - UNDO - revert back to WS previous state


## [~ Extras ~] 
 - experimental-scope-hoisting => does the same a Optimization chunk for webpacks...

- parcel build app/manifest.json --no-source-maps --experimental-scope-hoisting --detailed-report 5 --bundle-node-modules