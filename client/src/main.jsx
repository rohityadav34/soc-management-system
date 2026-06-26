import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import store from './redux/store.js'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}  >
    <App />
    </Provider>
    </BrowserRouter>
   
  </StrictMode>,
)

// NOTE  role => null  api call success => role : 'admin' => role ? ui;
// NOTE count = 0   increment =>  count + 1 => 0 to 1 ;
