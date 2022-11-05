import '../styles/Cell.css'

function Cell(props)
{
    return(
        props.gagne ?
            (<button key={props.ref} className={['cellule', props.jouable === true ? 'jouable' : ''].join(' ')}> {props.valeur} </button>)
            :
            (<button key={props.ref} className={['cellule', props.jouable === true ? 'jouable' : ''].join(' ')} onClick={props.onClick}> {props.valeur} </button>)
    )
}

export default Cell;