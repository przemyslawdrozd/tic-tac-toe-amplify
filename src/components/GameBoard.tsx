import { Button, Card, Grid, View, Flex } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { WIN_PATTERN } from '../utils/conts'

const GameBoard = () => {
  const { currentGame, resetGame, setWinner, userData, player, winner } =
    useStateContext()

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

  return (
    <>
      {currentGame?.Board ? (
        <View width='90vw' maxWidth={600}>
          <Grid templateColumns='1fr 1fr 1fr' templateRows='20vh 20vh 20vh'>
            {currentGame.Board.map((cell, i) => (
              <Button
                backgroundColor={currentGame.isWinner ? 'gray' : 'white'}
                key={i}
                size='large'
                onClick={() => handleMove(i)}>
                {cell}
              </Button>
            ))}
          </Grid>
          <Card variation='elevated'>Game: {currentGame.id}</Card>
        </View>
      ) : null}
    </>
  )
}

export default GameBoard
