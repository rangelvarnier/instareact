import React, {Component} from 'react';
import FotoItem from './FotoItem';
import '../css/timeline.css';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import LogicaTimeline from '../logicas/LogicaTimeline';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotos: [],
            login: this.props.login
        }
        this.logicaTimeline = new LogicaTimeline([]);
    }

    carregaFotos() {
        const urlPerfil = !!this.login
            ? `http://localhost:8080/api/public/fotos/${this.login}`
            : `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`

        fetch(urlPerfil)
            .then(retorno => retorno.json())
            .then(fotos => {
                this.setState({fotos: fotos})
                this.logicaTimeline = new LogicaTimeline(fotos);
            })
    }

    like(fotoId) {
        this.logicaTimeline.like(fotoId);
    }

    comenta(fotoId, comentario) {
        this.logicaTimeline.comenta(fotoId, comentario);
    }

    componentWillMount() {
        Pubsub.subscribe('timeline', (topico, fotos) => {
            this.setState({fotos});
        });

        Pubsub.subscribe('novos-comentarios', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos
                .find(foto => foto.id === infoComentario.fotoId);

            fotoAchada.comentarios
                .push(infoComentario.novoComentario);

            this.setState({fotos: this.state.fotos});
        });
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.login) {
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
                    {this
                        .state
                        .fotos
                        .map(foto => 
                            <FotoItem 
                                key={foto.id} 
                                foto={foto} 
                                like={this.like.bind(this)} 
                                comenta={this.comenta.bind(this)}/>
                        )
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}