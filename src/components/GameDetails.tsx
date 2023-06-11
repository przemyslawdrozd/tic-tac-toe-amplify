import { Flex, Card, Button, Loader } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { INIT_BOARD } from '../utils/conts'

const GameDetails = () => {
  const {
    currentGame,
    userData,
    setWinner,
    setCurrentGame,
    setPlayer,
    winner,
  } = useStateContext()

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

  return (
    <Flex
      direction='row'
      justifyContent='space-between'
      alignItems='stretch'
      height='100w'>
      {currentGame ? (
        <>
          <Card variation='elevated' width='25vw'>
            PlayerX: {currentGame.PlayerX.split('-')[0]}
          </Card>
          {currentGame.isWinner ? (
            <>
              {winner && (
                <div>
                  <p>{`Winner is ${winner}!`}</p>
                </div>
              )}
            </>
          ) : (
            currentGame?.CurrentPlayer && (
              <p>
                Now is Player <b>{currentGame.CurrentPlayer} </b> move!
              </p>
            )
          )}
          {!winner && currentGame?.Board?.every(value => value) && (
            <div>It's a draw!</div>
          )}
          <Card variation='elevated' width='25vw'>
            PlayerO:{' '}
            {currentGame?.PlayerO?.split('-')[0] || 'Waiting to join..'}
            {currentGame?.PlayerO ? null : <Loader variation='linear' />}
          </Card>
        </>
      ) : (
        <Button onClick={createNewGame}>Create Game</Button>
      )}
    </Flex>
  )
}

export default GameDetails
