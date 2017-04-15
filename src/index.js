import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import App from './App';
import Login from './componentes/login/Login';
import Logout from './componentes/logout/Logout';
import {Router, Route, browserHistory} from 'react-router';

function verificaAutenticacao(nextState, replace){
  if(localStorage.getItem('auth-token') === null){
    replace('/?msg=Você deve estar logado para acessar o endereço');
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/logout" component={Logout}/>
    <Route path="/timeline" component={App} onEnter={verificaAutenticacao}/>
  </Router>
), document.getElementById('root'));
