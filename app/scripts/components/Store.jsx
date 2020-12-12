import React from "react";
import globalHook from 'use-global-hook';

const initialState = {
  counter: 0,
  entities: [],
  selectedTaskIds: [],
  draggingTaskId: null,
  state: [],
};

const actions = {
  addToCounter: (store, amount) => {
    const newCounterValue = store.state.counter + amount;
    store.setState({ counter: newCounterValue });
  },
  setState: ( store, tabs) => {
    store.setState({state: tabs})
  }
};

export default globalHook(React, initialState, actions);
