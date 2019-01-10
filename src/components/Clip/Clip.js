import React from 'react';
import './Clip.css';
export default props => {
  return (
    <div className={props.classDark?'clipDark Clip':'Clip'} style={props.styles} onClick={() => { props.clickHandler(props.index) }}>
      {props.children}
    </div>
  )
}
