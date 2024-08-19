import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // CSS do Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome para ícones
import { MDBContainer } from 'mdb-react-ui-kit';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <MDBContainer>
      <App />
    </MDBContainer>
  </React.StrictMode>,
  document.getElementById('root')
);
