import React from 'react';
import ReactDOM from 'react-dom';
import '@shopify/polaris/styles.css';
import App from '../app/App.js';

ReactDOM.hydrate(<App />, document.getElementById('app'));
