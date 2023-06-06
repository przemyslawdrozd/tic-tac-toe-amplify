import { useState, useEffect, createContext, useContext } from 'react'
import { Game, LazyGame } from '../models'
import { Auth } from 'aws-amplify'

type tUserData = {
  username: string
  id: string
} | null

interface iCtx {
  games: Game[] | []
  setGames: React.Dispatch<React.SetStateAction<Game[]>>
  currentGame: Game | LazyGame | null
  setCurrentGame: React.Dispatch<React.SetStateAction<Game | LazyGame | null>>
  userData: tUserData
  //   setUserData: React.Dispatch<
  //     React.SetStateAction<tUserData>
  //   >
}

const initCtx = {
  games: [],
  setGames: () => {},
  currentGame: null,
  setCurrentGame: () => {},
  userData: null,
  //   setUserData: () => {},
}

const Context = createContext<iCtx>(initCtx)

export const StateContext = ({ children }: { children: JSX.Element }) => {
  const [games, setGames] = useState<Game[]>([])
  const [currentGame, setCurrentGame] = useState<Game | LazyGame | null>(null)
  const [userData, setUserData] = useState<tUserData>(null)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(({ attributes }) => {
        setUserData({
          username: attributes.email.split('@')[0],
          id: attributes.sub,
        })
      })
      .catch(err => console.log('Err to fetch user data', err))
  }, [])

  return (
    <Context.Provider
      value={{ games, setGames, currentGame, setCurrentGame, userData }}>
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
