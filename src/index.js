import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import App from './App';
import Login from './componentes/login/Login';
import Logout from './componentes/logout/Logout';
import {Router, Route, browserHistory} from 'react-router';
import {matchPattern} from 'react-router/lib/PatternUtils';

function verificaAutenticacao(nextState, replace) {
  const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname);
  const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;
  if (enderecoPrivadoTimeline && localStorage.getItem('auth-token') === null) {
    replace('/?msg=Você deve estar logado para acessar o endereço');
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/logout" component={Logout}/>
    <Route
      path="/timeline(/:login)"
      component={App}
      onEnter={verificaAutenticacao}/>
  </Router>
), document.getElementById('root'));