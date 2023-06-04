// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Player = {
  "X": "X",
  "O": "O"
};

const { Game } = initSchema(schema);

export {
  Game,
  Player
};