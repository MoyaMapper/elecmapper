import React from 'react';
import { connect } from 'react-redux';
import { Empty } from 'antd';
import classNames from 'classnames';
import { constants } from './store';
import './format.scss';

const Format = (props) => {
  const formatClassName = classNames({
    'formatWrapper': true,
    'fullshow': props.fullshow,
    'hidden': props.hidden
  })
  return (
    <div className={formatClassName}>
      {/* 我是Format组件 */}
      <Empty className="empty" description="暂无数据" />
    </div>
  )
}

const mapState = (state) => ({
  fullshow: state.getIn(['format', 'showType']) === constants.showType.full,
  hidden: state.getIn(['format', 'showType']) === constants.showType.hidden
})

export default connect(mapState, null)(Format);