import * as O from "../option"
import { Applicative, createApplicative } from "../../types/Applicative"
import { _URI, some, fromTaskOption, TaskOption } from "./task-option"
import { pipe } from "../../utils/flow"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  _URI,
  of: some,
  apply:
    <A, B>(fma: TaskOption<A>, fmf: TaskOption<(a: A) => B>): TaskOption<B> =>
    () =>
      fromTaskOption (fma).then (ma =>
        fromTaskOption (fmf).then (mf =>
          pipe (
            O.Do,
            O.apS ("a", ma),
            O.apS ("f", mf),
            O.map (({ f, a }) => f (a)),
          ),
        ),
      ),
})

export const { of, apply } = applicative
