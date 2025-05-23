import * as O from "../option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { _URI, some, fromIoOption, IOOption } from "./io-option"
import { pipe } from "../../utils/flow"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  _URI,
  of: some,
  apply:
    <A, B>(fma: IOOption<A>, fmf: IOOption<(a: A) => B>): IOOption<B> =>
    () =>
      pipe (
        O.Do,
        O.apS ("a", fromIoOption (fma)),
        O.apS ("f", fromIoOption (fmf)),
        O.map (({ a, f }) => f (a)),
      ),
})

export const { of, apply } = applicative
