import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Predicate: Predicate<A>
  }
}

export interface Predicate<A> {
  (a: A): boolean
}

export const _URI = "Predicate" satisfies URIS
