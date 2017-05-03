import React, {Component} from 'react';
import FotoItem from './FotoItem';
import '../css/timeline.css';
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

        this.logicaTimeline.lista(urlPerfil);
    }

    like(fotoId) {
        this.logicaTimeline.like(fotoId);
    }

    comenta(fotoId, comentario) {
        this.logicaTimeline.comenta(fotoId, comentario);
    }

    componentWillMount() {
        this.logicaTimeline.subscribe(fotos => {
            this.setState({fotos});
        })
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