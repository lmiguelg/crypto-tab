import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';

import Newtab from './Newtab';
import './index.css';

render(
  <IntlProvider locale="EN">
    <Newtab />
  </IntlProvider>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
