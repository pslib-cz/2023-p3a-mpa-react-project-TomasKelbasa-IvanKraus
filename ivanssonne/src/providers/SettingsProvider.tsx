import { PropsWithChildren, createContext, useReducer } from "react"

export enum TypeOfGame {
    PVP, PVC
}

export enum MeepleColors {
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    RED = "RED",
    BLACK = "BLACK"
}

export type SettingsType = {
    firstName: string,
    secondName: string,
    firstColor: MeepleColors,
    secondColor: MeepleColors,
    typeOfGame: TypeOfGame
}

export enum SettingsActionTypes
{
    SET_FIRST_NAME,
    SET_SECOND_NAME,
    SET_FIRST_COLOR,
    SET_SECOND_COLOR,
    SET_TYPE_OF_GAME
}

export type SettingsAction = {
    type: SettingsActionTypes,
    payload: string | MeepleColors | TypeOfGame
}

export type SettingsContextType = {
    state: SettingsType
    dispatch: React.Dispatch<SettingsAction>
}

const initialSettingsReducerState: SettingsType = {
    firstName: "Player1",
    secondName: "Player2",
    firstColor: MeepleColors.BLUE,
    secondColor: MeepleColors.RED,
    typeOfGame: TypeOfGame.PVP
}

const settingsReducer = (state: SettingsType, action: SettingsAction) => {
    if(action.payload === null || (action.payload as string).length <= 0) return state;
    switch(action.type){
        case SettingsActionTypes.SET_FIRST_NAME:  
            return {...state, firstName: action.payload as string};
        case SettingsActionTypes.SET_SECOND_NAME:
            return {...state, secondName: action.payload as string};
        case SettingsActionTypes.SET_FIRST_COLOR:
            return {...state, firstColor: action.payload as MeepleColors};
        case SettingsActionTypes.SET_SECOND_COLOR:
            return {...state, secondColor: action.payload as MeepleColors};
        case SettingsActionTypes.SET_TYPE_OF_GAME:
            return {...state, typeOfGame: action.payload as TypeOfGame};
        default:
            return state;
    }
}

export const SettingsContext = createContext<SettingsContextType>({state: initialSettingsReducerState, dispatch: () => {}});

export const SettingsProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(settingsReducer, initialSettingsReducerState);

    return (
        <SettingsContext.Provider value={{state, dispatch}}>
            {children}
        </SettingsContext.Provider>
    )
}
export default SettingsProvider;