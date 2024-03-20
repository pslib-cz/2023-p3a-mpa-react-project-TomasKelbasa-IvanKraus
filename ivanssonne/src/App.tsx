import logo from './assets/logo.png'
import './App.scss'
import Piece, { PieceType } from './components/Piece'
import { tileTypes } from '../data/tile_type'
import { useState } from 'react'
import Board from './components/Board'
import Game from './components/Game'

function App() {

  return (
    <>
      <Game />
    </>
  )
}

export default App
