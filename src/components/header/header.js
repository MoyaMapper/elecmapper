import React from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import { constants as editConstants, actionCreators as editActionCreators } from '../edit/store';
import { constants as formatConstants, actionCreators as formatActionCreators } from '../format/store';
import { homepage } from '../../common/constants';
import './header.scss';

// 导入 node.js 模块
const { shell } = window.require('electron');

const openHomePage = () => {
  shell.openExternal(homepage);
}

const Header = (props) => {
  return (
    <div className="headerWrapper">
      <span className="title">ElecMapper</span>
      <div className="tools">
        <Tooltip placement="topLeft" title="主页">
          <Icon className="menuIcon" type="github" onClick={openHomePage}/>
        </Tooltip>
        <Tooltip placement="topLeft" title="隐藏调整区">
          <Icon className="menuIcon" type="right-circle" onClick={props.hideFormatArea} />
        </Tooltip>
        <Tooltip placement="topLeft" title="还原">
          <Icon className="menuIcon" type="reload" onClick={props.resetAreaShow} />
        </Tooltip>
        <Tooltip placement="topLeft" title="隐藏编辑区">
          <Icon className="menuIcon" type="left-circle" onClick={props.hideEditArea} />
        </Tooltip>
      </div>
    </div>
  )
}

const mapDispatch = (dispatch) => ({
  hideEditArea() {
    dispatch(editActionCreators.switchShowType(editConstants.showType.hidden));
    dispatch(formatActionCreators.switchShowType(formatConstants.showType.full));
  },
  hideFormatArea() {
    dispatch(editActionCreators.switchShowType(editConstants.showType.full));
    dispatch(formatActionCreators.switchShowType(formatConstants.showType.hidden));
  },
  resetAreaShow() {
    dispatch(editActionCreators.switchShowType(editConstants.showType.half));
    dispatch(formatActionCreators.switchShowType(formatConstants.showType.half));
  }
})

export default connect(null, mapDispatch)(Header);