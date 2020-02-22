import React from 'react';
import { connect } from 'react-redux';
import './format.scss';

const Format = () => {
  return (
    <div className="formatWrapper">我是Format组件</div>
  )
}

export default connect(null, null)(Format);