import { Button, Heading } from '@aws-amplify/ui-react'
import styled from 'styled-components'

export const CreateButton = styled(Button)`
  background: linear-gradient(90deg, #f47d0b 0%, #ee4c58 100%);
  border-radius: 20px;
  color: white;
  border: none;
`

export const JoinButton = styled(Button)`
  background-color: #f2f2f2;
  border-radius: 24px;
  color: #f47d0b;
  width: 70%;
  margin-left: 15%;
  box-shadow: 8px 11px 20px -13px rgba(66, 68, 90, 1);
`

export const RoomTitle = styled(Heading)`
  color: #5b65a6;
  font-size: 36px;
`
