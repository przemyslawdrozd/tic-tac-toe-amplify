import { useState, useEffect, createContext, useContext } from 'react'
import { Game, LazyGame } from '../models'
import { Auth } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore'

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
  player: string
  setPlayer: React.Dispatch<React.SetStateAction<'X' | 'O' | ''>>
  winner: string
  setWinner: React.Dispatch<React.SetStateAction<string>>
}

const initCtx = {
  games: [],
  setGames: () => {},
  currentGame: null,
  setCurrentGame: () => {},
  userData: null,
  player: '',
  setPlayer: () => {},
  winner: '',
  setWinner: () => {},
}

const Context = createContext<iCtx>(initCtx)

export const StateContext = ({ children }: { children: JSX.Element }) => {
  const [games, setGames] = useState<Game[]>([])
  const [currentGame, setCurrentGame] = useState<Game | LazyGame | null>(null)
  const [userData, setUserData] = useState<tUserData>(null)
  const [player, setPlayer] = useState<'X' | 'O' | ''>('')
  const [winner, setWinner] = useState<string>('')

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

  // Update Available Games
  useEffect(() => {
    const subscription = DataStore.observe(Game).subscribe(msg => {
      if (
        msg.opType === 'DELETE' ||
        (msg.opType === 'UPDATE' && msg.element.PlayerO)
      ) {
        setGames(prevGames =>
          prevGames?.filter(({ id }) => id !== msg.element.id),
        )

        if (currentGame?.id === msg.element.id) {
          if (
            ![currentGame.PlayerO, currentGame.PlayerX].includes(userData?.id)
          ) {
            return setCurrentGame(null)
          }
        }
      }

      if (msg.opType !== 'INSERT') return
      if (games.find(({ id }) => id === msg.element.id)) {
        console.log('Already updated!')
        return
      }

      setGames(prevGames => [...prevGames, msg.element])
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const restoreGame = async () => {
      try {
        const responseGames = await DataStore.query(Game)
        setGames(responseGames)

        for (const game of responseGames) {
          const { PlayerX, PlayerO, isWinner } = game

          if (isWinner) continue

          if (userData?.id === PlayerX) {
            setCurrentGame(game)
            setPlayer('X')
          }

          if (userData?.id === PlayerO) {
            setCurrentGame(game)
            setPlayer('O')
          }
        }
      } catch (err) {
        console.log('Err restoring game', err)
      }
    }
    currentGame || restoreGame()
  }, [currentGame, userData?.id])

  return (
    <Context.Provider
      value={{
        games,
        setGames,
        currentGame,
        setCurrentGame,
        userData,
        player,
        setPlayer,
        winner,
        setWinner,
      }}>
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
