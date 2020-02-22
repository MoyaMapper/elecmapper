import React from 'react';
import { connect } from 'react-redux';
import './edit.scss';

const Edit = () => {
  return (
    <div className="editWrapper">我是Edit组件</div>
  )
}

export default connect(null, null)(Edit);