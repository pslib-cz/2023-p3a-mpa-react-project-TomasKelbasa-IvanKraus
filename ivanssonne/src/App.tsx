import logo from './assets/logo.png'
import './App.scss'
import Game from './components/Game'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import About from './components/About'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} /></>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App
