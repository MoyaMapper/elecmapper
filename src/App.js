import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/header/header';
import Edit from './components/edit/edit';
import Format from './components/format/format';
import { Layout } from 'antd';
import './App.scss';


const { Footer, Content } = Layout;

function App() {

  return (
    <Provider store={store}>
      <Header/>
      <Layout>
        <Layout>
          <Content className="contentWrapper">
          <Edit></Edit>
          <Format></Format>
          </Content>
        </Layout>
        <Footer className="footerWrapper">
          ElecMapper ©2020 Created by MoyaMapper
        </Footer>
      </Layout>
    </Provider>
  );
}

export default App;
