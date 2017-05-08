import {
    List
} from 'immutable';

export function timeline(state = new List(), action) {
    if (action.type === 'LISTAGEM') {
        return new List(action.fotos);
    }

    if (action.type === 'COMENTARIO') {
        const fotoEstadoAntigo = state.find(foto => foto.id === action.fotoId);
        const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);

        const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, {
            comentarios: novosComentarios
        })

        const indiceDaLista = state.findIndex(foto => foto.id === action.fotoId);
        const novaLista = state.set(indiceDaLista, fotoEstadoNovo);

        return novaLista;
    }

    if (action.type === 'LIKE') {
        const fotoEstadoAntigo = state.find(foto => foto.id === action.fotoId);
        fotoEstadoAntigo.likeada = !fotoEstadoAntigo.likeada;
        const possivelLiker = fotoEstadoAntigo.likers.find(likerAtual => likerAtual.login === action.liker.login);

        let novosLikers;
        if (possivelLiker === undefined) {
            novosLikers = fotoEstadoAntigo.likers.concat(action.liker);
        } else {
            novosLikers = fotoEstadoAntigo.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
        }

        const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, {
            likers: novosLikers
        })

        const indiceDaLista = state.findIndex(foto => foto.id === action.fotoId);
        const novaLista = state.set(indiceDaLista, fotoEstadoNovo);

        return novaLista;
    }
    return state;
}