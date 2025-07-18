import { createExtendable } from "../../types/Extendable"
import { Option, OptionHKT } from "./option"
import { Functor, map } from "./functor"
import { overload } from "../../utils/overloads"

export const Extendable = createExtendable<OptionHKT> ({
  ...Functor,
  extend: overload (
    1,
    <_, A, B>(self: Option<A>, fab: (fa: Option<A>) => B): Option<B> =>
      map (self, () => fab (self)),
  ),
})

export const { extend, duplicate } = Extendable
