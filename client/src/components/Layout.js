import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { observer } from 'mobx-react';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default observer(Layout);
