import { Button, Flex, Heading } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { Auth } from 'aws-amplify'

const Navbar = () => {
  const { userData, player, resetGame, currentGame } = useStateContext()
  return (
    <Flex direction='row' justifyContent='space-between' width='90vw'>
      <Flex direction='column' justifyContent='flex-start'>
        <Heading level={3}>My Id: {userData?.id.split('-')[0]}</Heading>
        <Heading level={4}>You: {player || 'Not selected'}</Heading>
      </Flex>
      <Flex direction='row'>
        {currentGame?.isWinner && (
          <Button size='large' onClick={resetGame}>
            Leave Room
          </Button>
        )}
        <Button size='large' onClick={() => Auth.signOut()}>
          Logout
        </Button>
      </Flex>
    </Flex>
  )
}

export default Navbar
