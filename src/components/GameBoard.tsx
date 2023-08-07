import { Button, Grid, View, Image, Card } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { WIN_PATTERN, getBorderStyle } from '../utils/conts'
import X from '../assets/X-player.svg'
import O from '../assets/O-player.svg'

const GameBoard = () => {
  const { currentGame, setWinner, player, winner } = useStateContext()

  const handleMove = (index: number) => {
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
        if (isWinner) updated.IsWinner = player
      }),
    )
  }

  return (
    <>
      {currentGame?.Board ? (
        <View width='90vw' maxWidth={600}>
          <Card style={{ borderRadius: '15px' }}>
            <Grid templateColumns='1fr 1fr 1fr' templateRows='20vh 20vh 20vh'>
              {currentGame.Board.map((cell, i) => (
                <Button
                  borderRadius='0px'
                  style={getBorderStyle(i)}
                  backgroundColor={currentGame.IsWinner ? 'gray' : 'white'}
                  key={i}
                  size='large'
                  onClick={() => handleMove(i)}>
                  {cell ? <Image alt='cell' src={cell === 'X' ? X : O} /> : ''}
                </Button>
              ))}
            </Grid>
          </Card>
        </View>
      ) : null}
    </>
  )
}

export default GameBoard
