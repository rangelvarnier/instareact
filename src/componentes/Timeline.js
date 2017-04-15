import React, {Component} from 'react';
import FotoItem from './FotoItem';
import '../css/timeline.css';

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
                {this
                    .state
                    .fotos
                    .map(foto => <FotoItem key={foto.id} foto={foto}/>)
}
            </div>
        );
    }
}