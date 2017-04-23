import React, {Component} from 'react';
import FotoItem from './FotoItem';
import '../css/timeline.css';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotos: [],
            login: this.props.login
        }
    }

    carregaFotos(){
        const urlPerfil = !!this.login 
        ? `http://localhost:8080/api/public/fotos/${this.login}` 
        : `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
        
        fetch(urlPerfil)
            .then(retorno => retorno.json())
            .then(fotos => {
                this.setState({fotos: fotos})
            })
    }

    like(fotoId){
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
        .then(response => {
            if(response.ok) {
                return response.json();
            }else{
                throw new Error("não foi possivel realizar like na foto");
            }
        })
        .then(liker => {
            Pubsub.publish('atualiza-liker', {fotoId, liker});
        })
    }

    componentWillMount(){
        Pubsub.subscribe('timeline', (topico, fotos) => {
            this.setState({fotos});
        });
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps){
        if(!!nextProps.login){
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like}/>)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}