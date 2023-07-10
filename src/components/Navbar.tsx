import { Button, Flex, Heading, Image } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { Auth } from 'aws-amplify'
import logo from '../assets/tix-tac-toe-logo.svg'

const Navbar = () => {
  const { userData, player, resetGame, currentGame } = useStateContext()

  const isLeaveGame = (): boolean =>
    !!currentGame?.IsWinner || !!currentGame?.Board?.every(v => v)

  return (
    <Flex direction='row' justifyContent='space-between' width='90vw'>
      <Flex direction='column' justifyContent='flex-start'>
        <Image alt='logo' src={logo} />
      </Flex>
      <Flex direction='row'>
        {isLeaveGame() && (
          <Button size='large' onClick={resetGame}>
            Leave Room
          </Button>
        )}
        <Heading level={4}>You: {player || 'Not selected'}</Heading>
        <Button
          style={{ borderRadius: '20px' }}
          backgroundColor='#f2f2f2'
          color='#6a74ad'
          size='large'
          onClick={() => Auth.signOut()}>
          Logout
        </Button>
      </Flex>
    </Flex>
  )
}

export default Navbar
