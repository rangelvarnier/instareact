import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import App from './App';
import Login from './componentes/login/Login';
import Logout from './componentes/logout/Logout';
import {Router, Route, browserHistory} from 'react-router';
import {matchPattern} from 'react-router/lib/PatternUtils';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {timeline} from './reducers/timeline';
import {notificacao} from './reducers/header';
import {Provider} from 'react-redux';

function verificaAutenticacao(nextState, replace) {
  const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname);
  const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;
  if (enderecoPrivadoTimeline && localStorage.getItem('auth-token') === null) {
    replace('/?msg=Você deve estar logado para acessar o endereço');
  }
}

const reducers = combineReducers({timeline, notificacao});
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Login}/>
      <Route path="/logout" component={Logout}/>
      <Route
        path="/timeline(/:login)"
        component={App}
        onEnter={verificaAutenticacao}/>
    </Router>
  </Provider>
), document.getElementById('root'));