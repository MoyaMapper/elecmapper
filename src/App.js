import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Edit from './components/edit/edit';
import Format from './components/format/format';
import { Layout } from 'antd';
import './App.scss';


const { Header, Footer, Content } = Layout;

function App() {

  return (

    <Provider store={store}>
      <Layout>
        <Header className="headerWrapper">Header</Header>
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
