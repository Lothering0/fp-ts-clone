import * as O from "../option"
import * as E from "../either"
import * as S from "../separated"
import { _URI } from "./array"
import { Compactable } from "../../types/Compactable"
import { flatMap } from "./monad"
import { reduce } from "./foldable"

const getInitialSeparated = <E, A>(): S.Separated<E[], A[]> => ({
  left: [],
  right: [],
})

export const compactable: Compactable<typeof _URI> = {
  _URI,
  compact: flatMap (a => O.isNone (a) ? [] : [O.fromSome (a)]),
  compactEithers: flatMap (a => E.isLeft (a) ? [] : [E.fromRight (a)]),
  separate: reduce (getInitialSeparated (), (b, ma) =>
    E.either (
      ma,
      e => ({ left: [...S.left (b), e], right: S.right (b) }),
      a => ({ left: S.left (b), right: [...S.right (b), a] }),
    ),
  ),
}

export const { compact, compactEithers, separate } = compactable
