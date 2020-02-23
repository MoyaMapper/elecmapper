import React, { useRef, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Select, Icon } from 'antd';
import classNames from 'classnames';
import { constants } from './store';
import './format.scss';

const { Option } = Select;
const { SwiftType, swiftTypeArr } = constants;

const Format = (props) => {

  const formatClassName = classNames({
    'formatWrapper': true,
    'fullshow': props.fullshow,
    'hidden': props.hidden
  })
  const columns = [
    { title: 'Key', dataIndex: 'jsonkey', width: 100 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (text, record, index) => {
        {
          const findIndex = swiftTypeArr.findIndex((item) => (record.type == item))
          if (findIndex === -1) 
            return <span>{record.type}</span>
          return (
            <Select 
              defaultValue={text} 
              style={{ width: 120 }} 
              onChange={() => { console.log('handleTypeChange', index) }}
            >
              <Option value={SwiftType.int}>{SwiftType.int}</Option>
              <Option value={SwiftType.bool}>{SwiftType.bool}</Option>
              <Option value={SwiftType.float}>{SwiftType.float}</Option>
              <Option value={SwiftType.double}>{SwiftType.double}</Option>
              <Option value={SwiftType.string}>{SwiftType.string}</Option>
            </Select>
          )
        }
      }
    },
    { title: '操作', dataIndex: 'action', width: 100, render: () => <Icon type="minus-circle" className="columnActionIconDel" /> },
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