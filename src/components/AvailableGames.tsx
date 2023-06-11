import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Loader,
} from '@aws-amplify/ui-react'
import { DataStore } from '@aws-amplify/datastore'
import { Game } from '../models'
import { useStateContext } from '../context/context'

const AvailableGames = () => {
  const { setWinner, setCurrentGame, setPlayer, userData, games, currentGame } =
    useStateContext()

  const handleJoin = async (gameId: string) => {
    try {
      const joinGame = await DataStore.query(Game, gameId)
      if (!joinGame) return

      if (joinGame?.PlayerO) {
        console.log('Other player already joined!')
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
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as='th' colSpan={3}>
                Available Games
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map(game => (
              <TableRow key={game.id}>
                <TableCell>{game.id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleJoin(game.id)}>Join</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default AvailableGames
