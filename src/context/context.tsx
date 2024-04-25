import { useState, useEffect, createContext, useContext } from 'react'
import { Game, LazyGame } from '../models'
import { Auth, Hub } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore'
import { INIT_BOARD } from '../utils/conts'

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
  resetGame: () => void
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
  resetGame: () => {},
}

const Context = createContext<iCtx>(initCtx)

export const StateContext = ({ children }: { children: JSX.Element }) => {
  const [games, setGames] = useState<Game[]>([])
  const [currentGame, setCurrentGame] = useState<Game | LazyGame | null>(null)
  const [userData, setUserData] = useState<tUserData>(null)
  const [player, setPlayer] = useState<'X' | 'O' | ''>('')
  const [winner, setWinner] = useState<string>('')

  // useEffect(() => {
  //   const mockGame = () => {
  //     return Array(9).fill(
  //       new Game({
  //         PlayerX: `${Math.random() * 0.001}123`,
  //         Board: INIT_BOARD,
  //         CurrentPlayer: 'X',
  //       }),
  //     )
  //   }

  //   setUserData({ username: 'username', id: '123' })
  //   console.log('mockgamr', mockGame())
  //   // setGames(mockGame())
  //   setCurrentGame(mockGame()[0])
  // }, [])

  // Restore logged user
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
    const sub = DataStore.observe(Game).subscribe(msg => {
      console.log('msg', msg)
      // if (!isAvailableGameValid(msg)) {
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
      

      if (msg.opType !== 'INSERT') return
      if (games.find(({ id }) => id === msg.element.id)) {
        console.log('Already updated!')
        return
      }

      setGames(prevGames => [...prevGames, msg.element])
    })

    return () => sub.unsubscribe()
  }, [])

  // Update Current Game
  useEffect(() => {
    console.log('check current game', currentGame)

    if (!currentGame) return
    const sub = DataStore.observe(Game, currentGame.id).subscribe(msg => {
      console.log('Observe msg', msg)
      setCurrentGame(msg.element)
      msg.element.IsWinner && setWinner(msg.element.IsWinner)
    })

    return () => sub.unsubscribe()
  }, [currentGame])

  // Restore Current Game
  useEffect(() => {
    const restoreGame = async () => {
      try {
        console.log('restoreGame', userData?.username)
        if (!userData) return
        const responseGames = await DataStore.query(Game, g =>
          g.or(({ PlayerO, PlayerX }) => [
            PlayerX.eq(userData.id),
            PlayerO.eq(userData.id),
          ]),
        )

        console.log('responseGames', responseGames)
        for (const game of responseGames) {
          const { PlayerX, PlayerO, IsWinner, Board } = game

          if (IsWinner || Board?.every(v => v)) continue

          //@ts-ignore
          if (!game._version) continue 

          console.log('move forward')
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

  // Restore Available Games
  useEffect(() => {
    const restoreRooms = async () => {
      try {
        const restoredRooms = await DataStore.query(Game, ({ PlayerO }) =>
          PlayerO.eq(null),
        )
        setGames(restoredRooms)
      } catch (err) {
        console.log('Err to restore room', err)
      }
    }
    currentGame || restoreRooms()
  }, [])

  // Check is valid current game
  useEffect(() => {
    if (!currentGame || !userData) return
    const { id } = userData

    const { PlayerX, PlayerO } = currentGame
    if (![PlayerX, PlayerO].includes(id)) {
      console.log('Its not your game!')
      setCurrentGame(null)
      setPlayer('')
    }
  }, [currentGame])

  // Auth login Hub Listener
  useEffect(() => {
    const authListenerHub = Hub.listen('auth', data => {
      if (data.payload.event === 'signIn') {
        const { email, sub } = data.payload.data.attributes
        setUserData({ id: sub, username: email.split('@')[0] })
      }
    })

    return () => authListenerHub()
  }, [])

  const resetGame = () => {
    setPlayer('')
    setWinner('')
    setCurrentGame(null)
  }

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
        resetGame,
      }}>
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
