import { Card, Collection, Divider, Heading, View } from '@aws-amplify/ui-react'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { useStateContext } from '../context/context'
import { JoinButton, RoomTitle } from './StyledComponents'

const AvailableGames = () => {
  const { setWinner, setCurrentGame, setPlayer, userData, games, currentGame } =
    useStateContext()

  const handleJoin = async (gameId: string) => {
    try {
      const joinGame = await DataStore.query(Game, gameId)
      if (!joinGame) return

      if (joinGame?.PlayerO) {
        alert('Other player already joined!')
        return
      }

      const updatedPost = await DataStore.save(
        Game.copyOf(joinGame, updated => {
          updated.PlayerO = userData?.id
        }),
      )

      setWinner('')
      setPlayer('O')
      setCurrentGame(updatedPost)
    } catch (err) {
      console.log('Err to join game', err)
    }
  }

  return (
    <>
      {currentGame ? null : (
        <Card variation='outlined' margin='0 10vw' borderRadius='12px'>
          <Collection
            items={games}
            type='list'
            direction='row'
            gap='20px'
            justifyContent='center'
            wrap='wrap'>
            {(item, index) => (
              <Card
                key={index}
                borderRadius='medium'
                maxWidth='20rem'
                variation='outlined'>
                <View padding='xs'>
                  <RoomTitle padding='medium'>Room {index + 1}</RoomTitle>
                  <Divider padding='xs' />
                  <Heading padding='medium'>{item.id.split('-')[0]}</Heading>
                  <JoinButton
                    variation='primary'
                    isFullWidth
                    onClick={() => handleJoin(item.id)}>
                    Join
                  </JoinButton>
                </View>
              </Card>
            )}
          </Collection>
        </Card>
      )}
    </>
  )
}
export default AvailableGames
