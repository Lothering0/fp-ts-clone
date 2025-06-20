import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { functor, map } from "./functor"
import { URI, right } from "./either"
import { isLeft, fromRight } from "./utils"

export const applicative: Applicative2<URI> = createApplicative2 ({
  ...functor,
  of: right,
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
})

export const { of, apply, ap } = applicative
