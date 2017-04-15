import React, {Component} from 'react';
import FotoItem from './FotoItem';
import '../css/timeline.css';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = {
            fotos: []
        }
    }

    carregaFotos(props){
        const urlPerfil = !!props.login 
        ? `http://localhost:8080/api/public/fotos/${props.login}` 
        : `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
        
        fetch(urlPerfil)
            .then(retorno => retorno.json())
            .then(fotos => {
                this.setState({fotos: fotos})
            })
    }

    componentDidMount() {
        this.carregaFotos(this.props);
    }

    componentWillReceiveProps(nextProps){
        if(!!nextProps.login){
            this.carregaFotos(nextProps);
        }
    }

    render() {
        return (
            <div className="fotos container">
                {this
                    .state
                    .fotos
                    .map(foto => <FotoItem key={foto.id} foto={foto}/>)
}
            </div>
        );
    }
}