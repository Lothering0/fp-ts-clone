import { Option, none, some } from "./option"
import { isNone } from "./refinements"
import { fromSome } from "./utils"
import { Monoid } from "../../types/Monoid"
import { Semigroup } from "../../types/Semigroup"
import { pipe } from "../../utils/flow"

export const getMonoid: {
  <A>(Semigroup: Semigroup<A>): Monoid<Option<A>>
} = S => ({
  empty: none,
  concat: mx => my =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : pipe (S.concat (fromSome (mx)) (fromSome (my)), some),
})
