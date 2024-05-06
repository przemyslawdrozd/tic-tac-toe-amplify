import { Button, Flex, Heading, Image } from '@aws-amplify/ui-react'
import { useStateContext } from '../context/context'
import { Auth } from 'aws-amplify'
import logo from '../assets/tix-tac-toe-logo.svg'
import { LogoutButton } from './StyledComponents'

const Navbar = () => {
  const { userData, resetGame, currentGame } = useStateContext()

  const isLeaveGame = (): boolean =>
    !!currentGame?.IsWinner || !!currentGame?.Board?.every(v => v)

  return (
    <Flex direction='row' justifyContent='space-between' width='90vw'>
      <Flex direction='column' justifyContent='flex-start'>
        <Image alt='logo' src={logo} />
      </Flex>
      <Flex direction='row' alignItems='center'>
        {isLeaveGame() && (
          <Button size='large' onClick={resetGame}>
            Leave Room
          </Button>
        )}
        <Heading level={4}>
          Hello, <b>{userData?.username || 'Not selected'}</b>
        </Heading>
        <LogoutButton size='large' onClick={() => Auth.signOut()}>
          Logout
        </LogoutButton>
      </Flex>
    </Flex>
  )
}

export default Navbar
