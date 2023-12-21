# workSpaceLive

meh, Just a simple tab manager with a few twists 🤷🏽‍♂️🫡

<img width="805" alt="image" src="https://github.com/Mimieam/workSpaceLive/assets/834291/ddbfdfde-3d8d-44aa-b1aa-e121cdf4479d">


## [~ Functionalities ~]
  - context Menu - 
      + add an open Tab to a WS 
      + create a WS from current browser window
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


## [~ Extras ~] 
- page activity timer - how long have I stayed and Interacted with a page? if less than 2 min - schedule for being closed in 15 min

- Create Open/Save workSpaces - in multiple contexts

```
    a WorkeSpace ==> DragDropContext
        a Window ==> Droppable
           a Tab ==> Draggable
```
