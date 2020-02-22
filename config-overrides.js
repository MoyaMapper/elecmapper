const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
);


// 在 create-react-app 中使用
// https://ant.design/docs/react/use-with-create-react-app-cn