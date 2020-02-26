import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Select, Icon, Input, message } from 'antd';
import classNames from 'classnames';
import { constants, actionCreators } from './store';
import ToolFooter from './components/toolFooter';
import { 
  flattenFormatDataArr, 
  deleteItemFromJsonData, 
  modifyItemTitle, 
  switchItemType, 
  modifyItemClassName, 
  exportSwiftModelFile 
} from './utils/helper';
import './format.scss';
import { fromJS } from 'immutable';
import useIpcRenderer from '../../hooks/useIpcRenderer';

const { Option } = Select;
const { SwiftType, swiftTypeArr } = constants;

const TABLE_TITLE_HEIGHT = 38;
const TABLE_FOOTER_HEIGHT = 54;

const Format = (props) => {

  const { jsonDataArr, updateJsonDataArr } = props;
  const formatClassName = classNames({
    'formatWrapper': true,
    'fullshow': props.fullshow,
    'hidden': props.hidden
  })
  const columns = [
    { // Key
      title: 'Key',
      dataIndex: 'jsonkey',
      width: 100,
      render: (text, record) => {
        return record.isRoot
          ? (<span>{text}</span>)
          : (
            <Input
              defaultValue={text}
              className="keyInput"
              onPressEnter={(e) => { updateJsonDataArr(modifyItemTitle(jsonDataArr, record, e.target.value)) }}
              onBlur={(e) => { updateJsonDataArr(modifyItemTitle(jsonDataArr, record, e.target.value)) }}
            />
          )
      }
    },
    { // 类型
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (text, record) => {
        {
          const findIndex = swiftTypeArr.findIndex((item) => (record.type == item))
          return (findIndex === -1
            ? (
              <Input
                defaultValue={record.type}
                className="keyInput"
                onPressEnter={(e) => { updateJsonDataArr(modifyItemClassName(jsonDataArr, record, e.target.value)) }}
                onBlur={(e) => { updateJsonDataArr(modifyItemClassName(jsonDataArr, record, e.target.value)) }}
              />
            )
            : (
              <Select
                defaultValue={text}
                style={{ width: 120 }}
                onChange={(val) => { updateJsonDataArr(switchItemType(jsonDataArr, record, val)) }}
              >
                <Option value={SwiftType.int}>{SwiftType.int}</Option>
                <Option value={SwiftType.bool}>{SwiftType.bool}</Option>
                <Option value={SwiftType.float}>{SwiftType.float}</Option>
                <Option value={SwiftType.double}>{SwiftType.double}</Option>
                <Option value={SwiftType.string}>{SwiftType.string}</Option>
                <Option value={SwiftType.array}>{SwiftType.array}</Option>
              </Select>
            )
          )
        }
      }
    },
    { // 操作
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (text, record, index) => {
        return (
          <Icon
            type="minus-circle"
            className="columnActionIconDel"
            onClick={() => { updateJsonDataArr(deleteItemFromJsonData(jsonDataArr, record)) }}
          />
        )
      }
    },
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

  useEffect(() => { // 初始化数据
    // console.log('ddd', props.jsonDataArr)
    const newJsonDataArr = fromJS(props.jsonDataArr).toJS()
    // 初始化 indexArr
    flattenFormatDataArr(newJsonDataArr)
    setData(newJsonDataArr)
  }, [jsonDataArr])

  const updateTableListHeight = (height = null) => {
    const containerHeight = height ? height : container.current.offsetHeight
    setTableListHeight(containerHeight - TABLE_TITLE_HEIGHT - TABLE_FOOTER_HEIGHT)
  }

  const handleExport = () => {
    console.log('handleExport')
    exportSwiftModelFile(jsonDataArr, () => {
      message.success('导出成功')
    })
  }

  // 监听原生菜单的导出
  useIpcRenderer({
    'export-file': handleExport
  })

  return (
    <div className={formatClassName} ref={container}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: tableListHeight }}
        size="small"
        indentSize={10}
      />
      <ToolFooter toExport={handleExport} />
    </div>
  )
}

const mapState = (state) => ({
  fullshow: state.getIn(['format', 'showType']) === constants.showType.full,
  hidden: state.getIn(['format', 'showType']) === constants.showType.hidden,
  jsonDataArr: state.getIn(['format', 'jsonDataArr']).toJS()
})

const mapDispatch = (dispatch) => ({
  updateJsonDataArr(value) {
    dispatch(actionCreators.updateJsonData(value));
  }
})

export default connect(mapState, mapDispatch)(Format);