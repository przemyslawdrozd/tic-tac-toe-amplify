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
        <Card
          variation='outlined'
          margin='2vh 10vw'
          borderRadius='12px'
          backgroundColor='#f4f6f5'
          border='none'
          boxShadow='0px 0px 15px -5px rgba(66, 68, 90, 1)'>
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
                variation='outlined'
                border='none'
                margin='12px 24px'
                backgroundColor='#f4f6f5'
                boxShadow='2px 2px 10px -2px rgba(66, 68, 90, 1)'>
                <View padding='xs'>
                  <RoomTitle padding='medium'>Room {index + 1}</RoomTitle>
                  <Divider padding='xs' />
                  <Heading padding='medium'>
                    Id: {item.id.split('-')[0]}
                  </Heading>
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
