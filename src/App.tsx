import { Flex, Divider } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Navbar from './components/Navbar'
import GameBoard from './components/GameBoard'
import GameDetails from './components/GameDetails'
import AvailableGames from './components/AvailableGames'

const App = () => {
  return (
    <Flex direction='column' alignItems='center'>
      <Navbar />
      <GameDetails />
      <GameBoard />
      <AvailableGames />
    </Flex>
  )
}

export default App
