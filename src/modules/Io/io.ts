import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Io: Io<A>
  }
}

export interface Io<A> {
  (): A
}

export const URI = "Io" satisfies URIS
export type URI = typeof URI

type IOConstructor = <A>(a: A) => Io<A>
export const io: IOConstructor = a => () => a

type FromIO = <A>(ma: Io<A>) => A
export const fromIo: FromIO = ma => ma ()
