import './App.scss'
import Game from './components/Game'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import About from './components/About'
import { useContext, useEffect } from 'react'
import { SettingsType, SettingsContext, SettingsActionTypes } from './providers/SettingsProvider'

function App() {

  const settingsContext = useContext(SettingsContext);

  useEffect(() => {
    const settingsFromStorage = sessionStorage.getItem('settings');
    if(settingsFromStorage){
        console.log("loading from session storage")
        const settings: SettingsType = JSON.parse(settingsFromStorage);
        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_NAME, payload: settings.firstName});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_NAME, payload: settings.secondName});
        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_COLOR, payload: settings.firstColor});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_COLOR, payload: settings.secondColor});
    }
},[]);

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
