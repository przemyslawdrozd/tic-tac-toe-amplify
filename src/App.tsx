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
import { Game } from './models'

const App = () => {
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<string>('')
  const [games, setGames] = useState<Game[]>([])
  const [username, setUsername] = useState<string>('')

  const board = useRef<string[]>(INIT_BOARD)

  const handleClick = (index: number) => {
    if (board.current[index] || winner) return

    board.current[index] = player
    for (let [a, b, c] of WIN_PATTERN) {
      if (!board.current[a]) continue

      if (
        board.current[a] === board.current[b] &&
        board.current[a] === board.current[c]
      )
        return setWinner(board.current[a])
    }
    setPlayer(player === 'X' ? 'O' : 'X')
  }

  console.log('player', player)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(({ attributes }) => {
        setUsername(attributes.email.split('@')[0])
      })
      .catch(err => console.log('Err to get user data', err))

    DataStore.query(Game)
      .then(setGames)
      .catch(err => console.log('Err query game', err))
  }, [])

  // const resetGame = () => {
  //   setBoard(INIT_BOARD)
  //   setPlayer('X')
  //   setWinner('')
  // }

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
    } catch (error) {
      console.log('Err create game', error)
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
          <TableRow>
            <TableCell>{game.id.split('-')[0]}</TableCell>
            {/* <TableCell>{game.createdAt}</TableCell> */}
            <TableCell>
              <Button>Join</Button>
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
        <Card variation='elevated'>{username}!</Card>
        <Button size='large' onClick={handleLogOut}>
          Logout
        </Button>
      </Flex>
      <View height='32rem' width='30rem'>
        <Grid
          templateColumns='1fr 1fr 1fr'
          templateRows='10rem 10rem 10rem'
          gap={tokens.space.small}>
          {board.current.map((cell, i) => (
            <Button size='large' onClick={() => handleClick(i)}>
              {cell}
            </Button>
          ))}
        </Grid>
      </View>
      {winner && <div className='winner'>{`Winner: ${winner}`}</div>}
      {!winner && board.current.every(value => value) && (
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
