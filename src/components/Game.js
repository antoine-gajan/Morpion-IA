import Cell from './Cell'
import '../styles/Game.css'
import {useState} from "react";

function Game()
{
    const [joueurActuel, updateJoueurActuel] = useState('X')
    const [gagne, updateGagne] = useState(false)
    const [tableau, updateTableau] = useState(Array(9).fill('a'))
    return(
        <div className={'game'}>
            {gagne === false ?
                (<span>Joueur actuel : {joueurActuel}</span>)
                : null}
            {gagne === true ?
                (<span>{joueurActuel} a gagné.</span>)
            :
            null}
            {gagne === false && fin() ?
                (<span>Match nul !</span>)
                :
                null
            }
            <div className={'board'}>
                <div>
                    {createCase(0)}
                    {createCase(1)}
                    {createCase(2)}
                </div>
                <div>
                    {createCase(3)}
                    {createCase(4)}
                    {createCase(5)}
                </div>
                <div>
                    {createCase(6)}
                    {createCase(7)}
                    {createCase(8)}
                </div>
            </div>

            {gagne ? (<button className={'new'} onClick={()=>newgame()}>Rejouer</button>) : null}
            <footer>
                <p className="footer"> Réalisé par Antoine GAJAN | 2022</p>
            </footer>
        </div>
    )

    function updateGame(ref) {
        //Humain joue
        if (coupPossible(ref) && !gagne) {
            const newTab = tableau.slice()
            newTab[ref] = joueurActuel === 'X' ? 'X' : 'O'
            updateTableau(newTab);
            //S'il gagne, on arrete le jeu (l'IA ne joue pas)
            if (win(newTab)) {
                updateGagne(true);
            }
            //Sinon l'IA joue
            else {
                IAJoue(newTab);
            }
        }
    }
    function coupPossible(valeur)
    {
        return (tableau[valeur] === 'a');
    }
    function createCase(indice)
    {
        return (<Cell key = {indice} onClick = {()=>updateGame(indice)} valeur = {tableau[indice]} jouable = {coupPossible(indice)}/>)
    }
    function fin()
    {
        //Plus de coups possibles
        for (var i = 0; i < 9; i++)
        {
            if (tableau[i] === 'a')
            {
                return false;
            }
        }
        return true;
    }

    function win(tab)
    {
        //gagne en ligne
        for (var i = 0; i < 3; i++)
        {
            if (tab[3*i] === tab[3*i+1] && tab[3*i+1] === tab[3*i+2] && tab[3*i] !== 'a')
            {
                return true;
            }
        }
        //gagne en colonne
        for (var i = 0; i < 3; i++)
        {
            if (tab[i] === tab[i+3] && tab[i] === tab[i+6] && tab[i] !== 'a')
            {
                return true;
            }
        }
        //gagne en diagonale
        var diagWin = [
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < diagWin.length; i++)
        {
            const [a, b, c] = diagWin[i];
            if (tab[a] !== 'a' && tab[b] === tab[a] && tab[c] === tab[b])
            {
                return true;
            }
        }
        return false
    }

    function newgame()
    {
        updateJoueurActuel('X');
        updateGagne(false);
        updateTableau(Array(9).fill('a'));
    }

    //Intelligence artificielle
    function evaluation(tab)
    {
        //Gagne en ligne
        for (var i = 0; i < 3; i++)
        {
            if (tab[3*i] === tab[3*i+1] && tab[3*i+1] === tab[3*i+2] && tab[3*i] !== 'a')
            {
                //IA gagne
                if (tab[3*i] === 'O')
                {
                    return 10;
                }
                else
                {
                    return -10;
                }
            }
        }
        //gagne en colonne
        for (var i = 0; i < 3; i++)
        {
            if (tab[i] === tab[i+3] && tab[i] === tab[i+6] && tab[i] !== 'a')
            {
                //IA gagne
                if (tab[i] === 'O')
                {
                    return 10;
                }
                //Joueue gagne
                else
                {
                    return -10;
                }
            }
        }
        //gagne en diagonale
        var diagWin = [
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < diagWin.length; i++)
        {
            const [a, b, c] = diagWin[i];
            if (tab[a] !== 'a' && tab[b] === tab[a] && tab[c] === tab[b])
            {
                //IA gagne
                if (tab[a] === 'O')
                {
                    return 10;
                }
                //Joueur gagne
                else
                {
                    return -10;
                }
            }
        }
        //Pas de vainqueur
        return 0;
    }

    function minimax(tab, profondeur, IAjoue)
    {
        let score = evaluation(tab);
        if (score === 10 || score === -10)
        {
            return score;
        }
        if (fin())
        {
            return 0;
        }
        if (IAjoue)
        {
            let meilleur_score = -1000;
            for (var i = 0; i < 9; i++)
            {
                if (tab[i] === 'a')
                {
                    tab[i] = 'O';
                    meilleur_score = Math.max(meilleur_score, minimax(tab, profondeur + 1, !IAjoue));
                    tab[i] = 'a';
                }
            }
            return meilleur_score;
        }
        else
        {
            let min_score = 1000;
            for (var i = 0; i < 9; i++)
            {
                if (tab[i] === 'a')
                {
                    tab[i] = 'X';
                    min_score = Math.min(min_score, minimax(tab, profondeur + 1, !IAjoue));
                    tab[i] = 'a'
                }
            }
            return min_score;
        }
    }

    function meilleur_mouvement(tab)
    {
        let meilleur_val = -1000;
        let indice_meilleur_coup = -1;
        for (var i = 0; i < 9; i++)
        {
            if (tab[i] === 'a')
            {
                tab[i] = 'O';
                let valeur = minimax(tab, 0, false);
                tab[i] = 'a';
                if (valeur > meilleur_val)
                {
                    meilleur_val = valeur;
                    indice_meilleur_coup = i;
                }
            }
        }
        return indice_meilleur_coup;
    }

    function sleep(milliseconds)
    {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    function IAJoue(tab)
    {
        updateJoueurActuel('O')
        let meilleur_move = meilleur_mouvement(tab);
        tab[meilleur_move] = 'O';
        updateTableau(tab);
        if (win(tab))
        {
            updateGagne(true);
        }
        else
        {
            updateJoueurActuel('X');
        }
    }
}

export default Game;