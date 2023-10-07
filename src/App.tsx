import { Flex, withAuthenticator } from '@aws-amplify/ui-react'
import Navbar from './components/Navbar'
import GameBoard from './components/GameBoard'
import GameDetails from './components/GameDetails'
import AvailableGames from './components/AvailableGames'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'

Amplify.configure(awsExports)

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

export default withAuthenticator(App)
