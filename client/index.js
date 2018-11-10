import React from 'react';
import ReactDOM from 'react-dom';
import '@shopify/polaris/styles.css';
import App from '../app/App.js';

console.log('Hi, this is from the client 👋');

ReactDOM.hydrate(<App />, document.getElementById('app'));