import { createApplicative } from "../../types/Applicative"
import { OptionHKT, Option, some } from "./option"
import { pipe } from "../../utils/flow"
import { Functor } from "./functor"
import { match } from "./utils"
import { zero } from "./alternative"

export const Applicative = createApplicative<OptionHKT> ({
  ...Functor,
  of: some,
  ap: fa => self =>
    match (zero, a =>
      pipe (
        self,
        match (zero, ab => pipe (a, ab, some)),
      ),
    ) (fa),
})

export const of: {
  <A>(a: A): Option<A>
} = Applicative.of

export const ap: {
  <A>(fa: Option<A>): <B>(self: Option<(a: A) => B>) => Option<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Option<(a: A) => B>): (self: Option<A>) => Option<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
