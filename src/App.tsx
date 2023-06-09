import { useEffect, useState } from 'react'
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
import { useStateContext } from './context/context'

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    games,
    currentGame,
    setCurrentGame,
    userData,
    player,
    winner,
    setPlayer,
    setWinner,
  } = useStateContext()

  const handleMove = (index: number) => {
    if (![currentGame?.PlayerO, currentGame?.PlayerX].includes(userData?.id)) {
      return resetGame()
    }
    if (!currentGame?.Board || winner) return
    if (currentGame.CurrentPlayer !== player) return

    const board = [...currentGame?.Board]

    if (board[index]) return
    board[index] = player

    let isWinner: boolean = false
    for (let [a, b, c] of WIN_PATTERN) {
      if (!board[a]) continue
      if (board[a] === board[b] && board[a] === board[c]) {
        setWinner(player)
        isWinner = true
      }
    }

    DataStore.save(
      Game.copyOf(currentGame, updated => {
        updated.Board = board
        updated.CurrentPlayer = player === 'X' ? 'O' : 'X'
        if (isWinner) updated.isWinner = player
      }),
    )
  }

  const resetGame = () => {
    setPlayer('')
    setWinner('')
    setCurrentGame(null)
  }

  const createNewGame = async () => {
    try {
      if (!userData) {
        console.log('Err there is no auth user')
        return
      }

      const result = await DataStore.save(
        new Game({
          PlayerX: userData.id,
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
      const joinGame = await DataStore.query(Game, gameId)
      if (!joinGame) return

      if (joinGame?.PlayerO) {
        console.log('Other player already joined!')
        return
      }

      const updatedPost = await DataStore.save(
        Game.copyOf(joinGame, updated => {
          updated.PlayerO = userData?.id
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

  console.log('currentGame', currentGame)
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
          {userData?.username}: {userData?.id.split('-')[0]} :{' '}
          {player || 'Not selected'}
        </Card>
        {currentGame && (
          <>
            <Card variation='elevated'>Game: {currentGame.id}</Card>
            <Card variation='elevated'>PlayerX: {currentGame.PlayerX}</Card>
            <Card variation='elevated'>PlayerO: {currentGame.PlayerO}</Card>
          </>
        )}
        <Button size='large' onClick={handleLogOut}>
          Logout
        </Button>
      </Flex>
      {currentGame && currentGame?.isWinner ? null : (
        <p>
          Now is Player <b>{currentGame?.CurrentPlayer} </b> move!
        </p>
      )}
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
            Leave Room
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
