import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Input, Row, Col, Button, message } from 'antd';
import jsonformat from '../../utils/jsonformat';
import classNames from 'classnames';
import { constants } from './store';
import { actionCreators as formatActionCreators } from '../format/store';
import './edit.scss';

const { TextArea } = Input;

const Edit = (props) => {
  let textArea = useRef(null);

  const toFormat = () => {
    const currentText = textArea.current.state.value
    if (currentText === undefined || !currentText.length) {
      message.warning('请先填写json数据');
      return;
    }
    // 格式化json数据
    const value = jsonformat(currentText, false)
    if (`${value}` === 'undefined') {
      console.log('进来了');
      message.error('无法格式化当前json数据');
      return;
    }

    // 清空数据
    textArea.current.setState({
      value
    });

    return value;
  }

  const toTransform = () => {
    const value = toFormat();
    value && props.transformJsonData(value);
  }

  const editClassName = classNames({
    'editWrapper': true,
    'fullshow': props.fullshow,
    'hidden': props.hidden
  })
  return (
    <div className={editClassName}>
      <TextArea
        className="textArea"
        placeholder="请填写json数据"
        allowClear
        ref={textArea}
      />
      <Row
        className="toolsRow"
        type="flex"
        justify="space-around"
      >
        <Col span={10}>
          <Button
            type="primary"
            block
            onClick={toFormat}
            className="toolsCol"
          >
            格式化
          </Button>
        </Col>
        <Col span={10}>
          <Button
            type="danger"
            block
            onClick={toTransform}
            className="toolsCol"
          >
            转换
          </Button>
        </Col>
      </Row>
    </div>
  )
}

const mapState = (state) => ({
  fullshow: state.getIn(['edit', 'showType']) === constants.showType.full,
  hidden: state.getIn(['edit', 'showType']) === constants.showType.hidden
})

const mapDispatch = (dispatch) => ({
  transformJsonData(value) {
    dispatch(formatActionCreators.transformJsonData(value))
  }
})

export default connect(mapState, mapDispatch)(Edit);