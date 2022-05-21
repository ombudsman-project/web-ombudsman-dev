import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './styles.scss';
import 'leaflet/dist/leaflet.css';
import 'react-loading-skeleton/dist/skeleton.css';
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-circular-progressbar/dist/styles.css';
// import '../node_modules/leaflet/dist/leaflet.css'
// import '../node_modules/leaflet/dist/leaflet.js'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { Spinner } from 'react-bootstrap';

const Loader = () => (
    <div className="App">
      <div>loading...</div>
    </div>
  );
  
ReactDOM.render(
    <Suspense fallback={<Spinner/>}><AppRouter /></Suspense>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();