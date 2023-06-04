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
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<string>('')
  const [games, setGames] = useState<Game[]>([])
  const [username, setUsername] = useState<string>('')
  const [currentGame, setCurrentGame] = useState<Game | LazyGame | null>(null)

  const handleMove = (index: number) => {
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

  console.log('player', player)

  // Update Current Game
  useEffect(() => {
    console.log('check current game')

    if (!currentGame) return
    const subscription = DataStore.observe(Game, currentGame.id).subscribe(
      msg => {
        console.log('Current game', msg)
        setCurrentGame(msg.element)
        msg.element.isWinner && setWinner(msg.element.isWinner)
      },
    )

    return () => subscription.unsubscribe()
  }, [currentGame])

  useEffect(() => {
    console.log('restore')
    const restoreGame = async () => {
      console.log('restore()')
      try {
        const { attributes } = await Auth.currentAuthenticatedUser()
        setUsername(attributes.email.split('@')[0])
        Auth.currentAuthenticatedUser()

        const responseGames = await DataStore.query(Game)

        setGames(responseGames)

        for (const game of responseGames) {
          console.log('sub', attributes.sub)
          const { PlayerX, PlayerO } = game

          if (attributes.sub === PlayerX) {
            setCurrentGame(game)
            setPlayer('X')
          }

          if (attributes.sub === PlayerO) {
            setCurrentGame(game)
            setPlayer('O')
          }
        }
      } catch (err) {
        console.log('Err restoring game', err)
      }
    }
    currentGame || restoreGame()
  }, [currentGame])

  // const resetGame = () => {
  //   setBoard(INIT_BOARD)
  //   setPlayer('X')
  //   setWinner('')
  // }

  // Update Available Games
  useEffect(() => {
    const subscription = DataStore.observe(Game).subscribe(msg => {
      if (msg.opType === 'DELETE') {
        return setGames(prevGames =>
          prevGames.filter(({ id }) => id !== msg.element.id),
        )
      }

      console.log('DS observe', msg)
      if (msg.opType !== 'INSERT') return
      console.log('Updated element', msg.element)
      if (games.find(({ id }) => id === msg.element.id)) {
        console.log('Already updated!')
        return
      }

      console.log('update')
      setGames(prevGames => [...prevGames, msg.element])
    })

    return () => subscription.unsubscribe()
  }, [])

  const createNewGame = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser()

      if (!attributes.sub) {
        console.log('Err there is no auth user')
        return
      }

      const result = await DataStore.save(
        new Game({
          PlayerX: attributes.sub,
          Board: INIT_BOARD,
          CurrentPlayer: 'X',
        }),
      )

      console.log('result', result)
      setCurrentGame(result)
      setPlayer('X')
    } catch (error) {
      console.log('Err create game', error)
    }
  }

  const handleJoin = async (gameId: string) => {
    try {
      const original = await DataStore.query(Game, gameId)
      if (!original) return

      const { attributes } = await Auth.currentAuthenticatedUser()

      const updatedPost = await DataStore.save(
        Game.copyOf(original, updated => {
          updated.PlayerO = attributes.sub
        }),
      )

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
      {winner && <div className='winner'>{`Winner: ${winner}`}</div>}
      {!winner && currentGame?.Board?.every(value => value) && (
        <div className='draw'>It's a draw!</div>
      )}
      <button className='reset-button' onClick={createNewGame}>
        Create Game
      </button>
      <HighlightExample />
    </Flex>
  )
}

export default withAuthenticator(App)
