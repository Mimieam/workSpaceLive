import React, { Component, useState } from 'react'
import './tabs.css'

export const Pane = props => {
  return ( <div>{ props.children }</div> )
}

export const PaneHeader = props => {
  const { child, index, selected } = props
  const activeClass = (selected === index ? 'active' : '');

  console.log(props)
  return (
    <li className={ activeClass } onClick={ props.onClick}>
      <a href="#"> {child.props.label} </a>
    </li>
  )
}

export const Tabs = props => {
  const [selected, setSelected] = useState(0);
  // const headersComponents = props.children.map(PaneHeader.bind(this))
  
  const headersComponents = props.children.map((value, i) => <PaneHeader key={ i } child={ value } onClick={ () => onClickHandler(i) }/>);
  
  const onClickHandler = async (idx) => {
    await setSelected(idx)
    console.log(selected)
  }

  const renderHeaders = () => {
    console.log(props)
    return (
      <ul> {headersComponents} </ul>
    );
  }

  const renderContent = () => {
    return (
      <div> {props.children[selected]} </div>
    );
  }

  return (
    <div>
      {renderHeaders()}
      {renderContent()}
    </div>
  )
}


// const Tab2s = React.createClass({
//   displayName: 'Tabs',
//   propTypes: {
//     selected: React.PropTypes.number,
//     children: React.PropTypes.oneOfType([
//       React.PropTypes.array,
//       React.PropTypes.element
//     ]).isRequired
//   },
//   getDefaultProps() {
//     return {
//       selected: 0
//     };
//   },
//   getInitialState() {
//     return {
//       selected: this.props.selected
//     };
//   },
//   handleClick(index, event) {
//     event.preventDefault();
//     this.setState({
//       selected: index
//     });
//   },
//   _renderTitles() {
//     function labels(child, index) {
//       let activeClass = (this.state.selected === index ? 'active' : '');
//       return (
//         <li>
//           <a href="#">
//             {child.props.label}
//           </a>
//         </li>
//       );
//     }
//     return (
//       <ul>
//         {this.props.children.map(labels.bind(this))}
//       </ul>
//     );
//   },
//   _renderContent() {
//     return (
//       <div>
//         {this.props.children[this.state.selected]}
//       </div>
//     );
//   },
//   render() {
//     return (
//       <div>
//         {this._renderTitles()}
//         {this._renderContent()}
//       </div>
//     );
//   }
// });
