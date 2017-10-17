import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './css/FormStyle.css';
import Form from './js/Form';

ReactDOM.render(<Form />, document.getElementById('root'));
registerServiceWorker();
