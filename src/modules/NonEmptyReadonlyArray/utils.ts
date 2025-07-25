import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const head: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at (0)!

export const init: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice (0, -1)

export const last: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at (-1)!

export const tail: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice (1)
