import { Button, Grid, View, Image, Card } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { WIN_PATTERN } from '../utils/conts'
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

  const getBorderStyle = (i: number) => {
    if (i === 0) return { borderTop: 'none', borderLeft: 'none' }
    if (i === 1) return { borderTop: 'none' }
    if (i === 2) return { borderTop: 'none', borderRight: 'none' }
    if (i === 3) return { borderLeft: 'none' }
    if (i === 5) return { borderRight: 'none' }
    if (i === 6) return { borderLeft: 'none', borderBottom: 'none' }
    if (i === 7) return { borderBottom: 'none' }
    if (i === 8) return { borderRight: 'none', borderBottom: 'none' }
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
