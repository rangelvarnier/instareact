import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import './login.css';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: this.props.location.query.msg
        }
    }

    envia(event) {
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({login: this.login.value, senha: this.senha.value}),
            headers: new Headers({'content-type': 'application/json'})
        }

        fetch('http://localhost:8080/api/public/login', requestInfo).then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Usuário ou senha invalido');
            }
        }).then(token => {
            localStorage.setItem('auth-token', token);
            browserHistory.push('/timeline');
        }).catch(err => {
            this.setState({msg: err.message});
        })
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">instalura</h1>
                <form
                    onSubmit={this
                    .envia
                    .bind(this)}>
                    <span>{this.state.msg}</span>
                    <input type="text" ref={(input) => this.login = input}/>
                    <input type="password" ref={(input) => this.senha = input}/>
                    <input type="submit" value="login"/>
                </form>
            </div>
        )
    }
}