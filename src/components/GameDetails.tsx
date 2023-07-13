import { Flex, Card, Button, Loader, Image } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { INIT_BOARD } from '../utils/conts'

import X from '../assets/X-player.svg'
import O from '../assets/O-player.svg'

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

  const CurrentGameInfo = (): JSX.Element => {
    if (!currentGame) return <></>

    if (!winner && currentGame?.Board?.every(v => v)) {
      return <p>It's a draw!</p>
    }

    if (currentGame.IsWinner && winner) {
      return <p>Winner is {winner}!</p>
    }

    return (
      <p>
        Now is Player <b>{currentGame.CurrentPlayer} </b> move!
      </p>
    )
  }

  return (
    <Flex
      direction='row'
      justifyContent='space-between'
      alignItems='stretch'
      height='100w'>
      {currentGame ? (
        <Flex alignContent='center'>
          <p
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image width='50%' height='50%' alt='cell' src={X} />
            {currentGame?.PlayerX?.split('-')[0]}
          </p>
          <CurrentGameInfo />
          <p
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {currentGame.PlayerO?.split('-')[0] || (
              <Loader variation='linear' />
            )}
            <Image width='50%' height='50%' alt='cell' src={O} />
          </p>
        </Flex>
      ) : (
        <Button onClick={createNewGame}>Create Game</Button>
      )}
    </Flex>
  )
}

export default GameDetails
