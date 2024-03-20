import logo from './assets/logo.png'
import './App.scss'
import Piece, { PieceType, rotatePiece } from './components/Piece'
import { tileTypes } from '../data/tile_type'
import { useState } from 'react'
import Board from './components/Board'
import Game from './components/Game'

function App() {

  const test = {
    id: 'test',
    placed: true,
    rotation: 0,
    positionX: 0,
    positionY: 0,
    tile: tileTypes[5]
  }

  const [testPiece, setTestPiece] = useState<PieceType>(test)

  return (
    <>
      <h1>Carcassonne in react</h1>
      <img src={logo} alt="logo" />
      <Game />
    </>
  )
}

export default App
