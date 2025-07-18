import { AsyncOption, toPromise } from "./async-option"
import { Semigroup } from "../../types/Semigroup"
import { overload } from "../../utils/overloads"

export const getRaceSemigroup: {
  <A>(): Semigroup<AsyncOption<A>>
} = () => ({
  concat: overload (
    1,
    (x, y) => () => Promise.race ([toPromise (x), toPromise (y)]),
  ),
})
