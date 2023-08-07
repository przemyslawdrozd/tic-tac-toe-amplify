import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum Player {
  X = "X",
  O = "O"
}



type EagerGame = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Game, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PlayerX?: string | null;
  readonly PlayerO?: string | null;
  readonly Board?: (string | null)[] | null;
  readonly IsWinner?: Player | keyof typeof Player | null;
  readonly CurrentPlayer: Player | keyof typeof Player;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGame = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Game, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PlayerX?: string | null;
  readonly PlayerO?: string | null;
  readonly Board?: (string | null)[] | null;
  readonly IsWinner?: Player | keyof typeof Player | null;
  readonly CurrentPlayer: Player | keyof typeof Player;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Game = LazyLoading extends LazyLoadingDisabled ? EagerGame : LazyGame

export declare const Game: (new (init: ModelInit<Game>) => Game) & {
  copyOf(source: Game, mutator: (draft: MutableModel<Game>) => MutableModel<Game> | void): Game;
}