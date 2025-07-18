import { createExtendable } from "../../types/Extendable"
import { overload } from "../../utils/overloads"
import { ArrayHKT } from "./array"
import { Functor } from "./functor"
import { matchLeft, prepend } from "./utils"

export const Extendable = createExtendable<ArrayHKT> ({
  ...Functor,
  extend: overload (1, <A, B>(self: A[], fab: (fa: A[]) => B): B[] =>
    matchLeft (
      self,
      () => [],
      (head, tail) => [fab (prepend (head, tail)), ...extend (tail, fab)],
    ),
  ),
})

export const { extend, duplicate } = Extendable
