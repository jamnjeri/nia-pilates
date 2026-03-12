import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; //
import { store } from './redux/store'; // Ensure path is correct
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App here */}
      <App />
    </Provider>
  </React.StrictMode>
);
