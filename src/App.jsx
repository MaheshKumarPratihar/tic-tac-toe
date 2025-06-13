import { useState } from "react"

import Player from "./components/Player"
import GameBoard from "./components/GameBoard"
import Log from "./components/Log";
import GameOver from "./components/GamerOver";

import { WINNING_COMBINATIONS } from "./winning-combinations";

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

function derivedActivePlayer(gameTurns){
  let currentPlayer = 'X';

  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currentPlayer ='O';
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...initialGameBoard.map(array => [...array])];
  
  for(const turn of gameTurns){
      const {square, player} = turn;

      const {row, col} = square;

      gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players){
  let winner = null;
  for(const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && secondSquareSymbol === thirdSquareSymbol){
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {

  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  
  // const [activePlayer, setActivePlayer] = useState('X');

  const activePlayer = derivedActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hadDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex){

    setGameTurns(prevTurns => {

      let currentPlayer = derivedActivePlayer(prevTurns);

      const updateTurns = [{square: {row: rowIndex, col: colIndex}, player: currentPlayer}, 
        ...prevTurns
      ];

      return updateTurns;
    })
  }

  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player onChangeName={handlePlayerNameChange} initialName={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'}/>          
          <Player onChangeName={handlePlayerNameChange}  initialName={PLAYERS.O}  symbol="O" isActive={activePlayer === 'O'}/>    
        </ol>
        {(winner || hadDraw) && <GameOver onRestart={handleRestart} winner={winner}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
      </div>
      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
