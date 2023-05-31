import { useState } from 'react'
import { Button, Grid, Flex, View, useTheme } from '@aws-amplify/ui-react'
import { INIT_BOARD, WIN_PATTERN } from './utils/conts'

const App = () => {
  const [board, setBoard] = useState<string[]>(INIT_BOARD)
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<string>('')

  const handleClick = (index: any) => {
    if (board[index] || winner) return

    const updatedBoard = [...board]
    updatedBoard[index] = player
    setBoard(updatedBoard)

    for (let [a, b, c] of WIN_PATTERN) {
      if (
        updatedBoard[a] &&
        updatedBoard[a] === updatedBoard[b] &&
        updatedBoard[a] === updatedBoard[c]
      )
        return setWinner(updatedBoard[a])
    }

    console.log('set new player')
    setPlayer(player === 'X' ? 'O' : 'X')
  }

  const resetGame = () => {
    setBoard(INIT_BOARD)
    setPlayer('X')
    setWinner('')
  }

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
          {board.map((cell, i) => (
            <Button size='large' onClick={() => handleClick(i)}>
              {cell}
            </Button>
          ))}
        </Grid>
      </View>
      {winner && <div className='winner'>{`Winner: ${winner}`}</div>}
      {!winner && board.every(value => value) && (
        <div className='draw'>It's a draw!</div>
      )}
      <button className='reset-button' onClick={resetGame}>
        Reset
      </button>
    </Flex>
  )
}

export default App
