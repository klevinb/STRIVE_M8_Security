import React from 'react';
import Login from './components/Auth/Login';
import SelectCities from './components/SelectCities';
import Weather from './components/Weather';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './styles/MainCss.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' exact component={Login} />
        <Route path='/selectCities' exact component={SelectCities} />
        <Route path='/weather' exact component={Weather} />
      </div>
    </Router>
  );
}

export default App;
