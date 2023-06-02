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
} from '@aws-amplify/ui-react'
import { INIT_BOARD, WIN_PATTERN } from './utils/conts'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from './models'

const App = () => {
  // const [board, setBoard] = useState<string[]>(INIT_BOARD)
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<string>('')
  const [games, setGames] = useState<string[][]>([])

  const board = useRef<string[]>(INIT_BOARD)

  const handleClick = (index: number) => {
    console.log('clicked')
    if (board.current[index] || winner) return

    // const newBoard = [...board]

    board.current[index] = player
    console.log('update board', board.current)
    // setBoard(newBoard)

    for (let [a, b, c] of WIN_PATTERN) {
      if (!board.current[a]) continue

      if (
        board.current[a] === board.current[b] &&
        board.current[a] === board.current[c]
      )
        return setWinner(board.current[a])
    }

    console.log('set new player')
    setPlayer(player === 'X' ? 'O' : 'X')
  }

  console.log('player', player)

  useEffect(() => {
    DataStore.query(Game)
      .then(result => {
        console.log('result', result)
        // const foundGames =
      })
      .catch(err => console.log('Err query game', err))
  }, [])

  // const resetGame = () => {
  //   setBoard(INIT_BOARD)
  //   setPlayer('X')
  //   setWinner('')
  // }

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
          Board: JSON.stringify(INIT_BOARD),
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
        <TableRow>
          <TableCell>Highlighted on hover</TableCell>
          <TableCell>Highlighted on hover</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Highlighted on hover</TableCell>
          <TableCell>Highlighted on hover</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )

  const { tokens } = useTheme()
  return (
    <Flex
      direction='column'
      justifyContent='flex-start'
      alignItems='stretch'
      alignContent='flex-start'
      wrap='nowrap'
      gap='1rem'>
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
