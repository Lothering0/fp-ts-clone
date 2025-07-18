import * as A from "../Array"
import { Tree } from "./tree"
import { Eq } from "../../types/Eq"
import { overload } from "../../utils/overloads"
import { forestOf, valueOf } from "./utils"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Tree<A>>
} = Eq => ({
  equals: overload (
    1,
    (mx, my) =>
      Eq.equals (valueOf (mx), valueOf (my)) &&
      A.getEq (getEq (Eq)).equals (forestOf (mx), forestOf (my)),
  ),
})
