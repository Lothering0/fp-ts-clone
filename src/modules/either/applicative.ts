import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { map } from "./functor"
import { _URI, right, fromRight, isLeft } from "./either"

export const applicative: Applicative2<typeof _URI> = createApplicative2 ({
  _URI,
  of: right,
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
})

export const { of, apply } = applicative
