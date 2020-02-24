import React from 'react';
import { Button } from 'antd';
import './toolFooter.scss';

const ToolFooter = (props) => { 
  return (
    <div className="toolFooterWrapper">
      <Button 
        className="exportBtn" 
        icon="export"
        block
        onClick={() => { props.toExport() }}
      >
        导出
      </Button>
    </div>
  )
}

export default ToolFooter;