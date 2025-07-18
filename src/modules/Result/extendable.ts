import { createExtendable } from "../../types/Extendable"
import { overload } from "../../utils/overloads"
import { Result, ResultHKT } from "./result"
import { Functor, map } from "./functor"

export const Extendable = createExtendable<ResultHKT> ({
  ...Functor,
  extend: overload (
    1,
    <_, A, B>(self: Result<_, A>, fab: (fa: Result<_, A>) => B): Result<_, B> =>
      map (self, () => fab (self)),
  ),
})

export const { extend, duplicate } = Extendable
