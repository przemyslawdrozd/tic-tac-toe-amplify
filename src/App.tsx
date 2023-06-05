import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Grid,
  Flex,
  View,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
} from '@aws-amplify/ui-react'
import { INIT_BOARD, WIN_PATTERN } from './utils/conts'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore'
import { Game, LazyGame } from './models'

const App = () => {
  const [player, setPlayer] = useState<'X' | 'O' | ''>('')
  const [winner, setWinner] = useState<string>('')
  const [games, setGames] = useState<Game[]>([])
  const [username, setUsername] = useState<string>('')
  const [currentGame, setCurrentGame] = useState<Game | LazyGame | null>(null)
  const [sub, setSub] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleMove = (index: number) => {
    if (![currentGame?.PlayerO, currentGame?.PlayerX].includes(sub)) {
      return resetGame()
    }
    if (!currentGame?.Board || winner) return
    if (currentGame.CurrentPlayer !== player) return

    const board = [...currentGame?.Board]

    if (board[index]) return
    board[index] = player

    DataStore.save(
      Game.copyOf(currentGame, updated => {
        updated.Board = board
        updated.CurrentPlayer = player === 'X' ? 'O' : 'X'
      }),
    )

    for (let [a, b, c] of WIN_PATTERN) {
      if (!board[a]) continue
      if (board[a] === board[b] && board[a] === board[c]) {
        setWinner(player)
        return DataStore.save(
          Game.copyOf(currentGame, updated => {
            updated.isWinner = player
          }),
        )
      }
    }
  }

  // Update Current Game
  useEffect(() => {
    console.log('check current game')

    if (!currentGame) return
    const sub = DataStore.observe(Game, currentGame.id).subscribe(msg => {
      console.log('Current game', msg)
      setCurrentGame(msg.element)
      msg.element.isWinner && setWinner(msg.element.isWinner)
    })

    return () => sub.unsubscribe()
  }, [currentGame])

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(({ attributes }) => {
        setSub(attributes.sub)
        setUsername(attributes.email.split('@')[0])
      })
      .catch(err => console.log('Err to fetch user data', err))
  }, [])

  useEffect(() => {
    const restoreGame = async () => {
      try {
        const responseGames = await DataStore.query(Game)
        setGames(responseGames)

        for (const game of responseGames) {
          const { PlayerX, PlayerO, isWinner } = game

          if (!isWinner) continue

          if (sub === PlayerX) {
            setCurrentGame(game)
            setPlayer('X')
          }

          if (sub === PlayerO) {
            setCurrentGame(game)
            setPlayer('O')
          }
        }
      } catch (err) {
        console.log('Err restoring game', err)
      }
    }
    currentGame || restoreGame()
  }, [currentGame, sub])

  const resetGame = () => {
    setPlayer('')
    setWinner('')
    setCurrentGame(null)
  }

  // Update Available Games
  useEffect(() => {
    const subscription = DataStore.observe(Game).subscribe(msg => {
      console.log('msg', msg)

      if (
        msg.opType === 'DELETE' ||
        (msg.opType === 'UPDATE' && msg.element.PlayerO)
      ) {
        setGames(prevGames =>
          prevGames?.filter(({ id }) => id !== msg.element.id),
        )

        if (currentGame?.id === msg.element.id) {
          if (![currentGame.PlayerO, currentGame.PlayerX].includes(sub)) {
            console.log('Expel player')
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

  const createNewGame = async () => {
    try {
      if (!sub) {
        console.log('Err there is no auth user')
        return
      }

      const result = await DataStore.save(
        new Game({
          PlayerX: sub,
          Board: INIT_BOARD,
          CurrentPlayer: 'X',
        }),
      )

      setWinner('')
      setCurrentGame(result)
      setPlayer('X')
    } catch (error) {
      console.log('Err create game', error)
    }
  }

  const handleJoin = async (gameId: string) => {
    try {
      await DataStore.start()
      const joinGame = await DataStore.query(Game, gameId)
      if (!joinGame) return

      if (joinGame?.PlayerO) {
        console.log('Other player already joined!')
        return
      }

      const updatedPost = await DataStore.save(
        Game.copyOf(joinGame, updated => {
          updated.PlayerO = sub
        }),
      )

      setWinner('')
      setCurrentGame(updatedPost)
      setPlayer('O')
    } catch (err) {
      console.log('Err to join game', err)
    }
  }

  const HighlightExample = () => (
    <Table highlightOnHover={true}>
      <TableHead>
        <TableRow>
          <TableCell as='th' colSpan={2}>
            Available Games
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {games.map(game => (
          <TableRow key={game.id}>
            <TableCell>{game.id.split('-')[0]}</TableCell>
            {/* <TableCell>{game.createdAt}</TableCell> */}
            <TableCell>
              <Button onClick={() => handleJoin(game.id)}>Join</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const handleLogOut = async () => {
    await Auth.signOut()
  }

  const { tokens } = useTheme()
  return (
    <Flex
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      alignContent='center'
      wrap='nowrap'
      gap='1rem'>
      <Flex
        direction='row'
        justifyContent='space-between'
        alignItems='stretch'
        height='100w'
        gap='1rem'>
        <Card variation='elevated'>
          {username}: {player}
        </Card>
        {currentGame && (
          <Card variation='elevated'>Game: {currentGame.id}</Card>
        )}
        <Button size='large' onClick={handleLogOut}>
          Logout
        </Button>
      </Flex>
      {currentGame?.Board && (
        <View height='32rem' width='30rem'>
          <Grid
            templateColumns='1fr 1fr 1fr'
            templateRows='10rem 10rem 10rem'
            gap={tokens.space.small}>
            {currentGame.Board.map((cell, i) => (
              <Button key={i} size='large' onClick={() => handleMove(i)}>
                {cell}
              </Button>
            ))}
          </Grid>
        </View>
      )}
      {winner && (
        <div className='winner'>
          <p>{`Winner: ${winner}`}</p>
          <Button size='large' onClick={resetGame}>
            Reset Game
          </Button>
        </div>
      )}
      {!winner && currentGame?.Board?.every(value => value) && (
        <div className='draw'>It's a draw!</div>
      )}
      {currentGame ? null : (
        <>
          <button className='reset-button' onClick={createNewGame}>
            Create Game
          </button>
          <HighlightExample />
        </>
      )}
    </Flex>
  )
}

export default withAuthenticator(App)
