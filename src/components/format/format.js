import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import classNames from 'classnames';
import { constants } from './store';
import './format.scss';

const Format = (props) => {

  const formatClassName = classNames({
    'formatWrapper': true,
    'fullshow': props.fullshow,
    'hidden': props.hidden
  })
  const columns = [
    { title: 'Key', dataIndex: 'jsonkey', width: 100 },
    { title: '类型', dataIndex: 'type', width: 100 }
  ]

  let container = useRef(null)
  let [tableListHeight, setTableListHeight] = useState(100)
  let [data, setData] = useState([])

  useEffect(() => { // 监听窗口大小，并更新列表高度
    const handleResize = (e) => {
      updateTableListHeight()
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => { // 更新列表高度
    updateTableListHeight()
  }, [])

  useEffect(() => {
    console.log('ddd', props.jsonDataArr)
    setData(props.jsonDataArr)
  }, [props.jsonDataArr])

  const updateTableListHeight = (height = null) => {
    const containerHeight = height ? height : container.current.offsetHeight
    setTableListHeight(containerHeight - 38)
  }

  return (
    <div className={formatClassName} ref={container}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: tableListHeight }}
        size="small"
      />
    </div>
  )
}

const mapState = (state) => ({
  fullshow: state.getIn(['format', 'showType']) === constants.showType.full,
  hidden: state.getIn(['format', 'showType']) === constants.showType.hidden,
  jsonDataArr: state.getIn(['format', 'jsonDataArr']).toJS()
})

export default connect(mapState, null)(Format);