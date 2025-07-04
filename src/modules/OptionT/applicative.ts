import * as O from "../Option"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"

interface Ap2CPointed<URI extends URIS2, _> {
  <A, B>(
    fmf: Kind2<URI, _, O.Option<(a: A) => B>>,
    fma: Kind2<URI, _, O.Option<A>>,
  ): Kind2<URI, _, O.Option<B>>
}

interface Ap2Pointed<URI extends URIS2> {
  <_, A, B>(
    fmf: Kind2<URI, _, O.Option<(a: A) => B>>,
    fma: Kind2<URI, _, O.Option<A>>,
  ): Kind2<URI, _, O.Option<B>>
}

interface ApPointed<URI extends URIS> {
  <A, B>(
    fmf: Kind<URI, O.Option<(a: A) => B>>,
    fma: Kind<URI, O.Option<A>>,
  ): Kind<URI, O.Option<B>>
}

interface Ap2CPointFree<URI extends URIS2, _> {
  <A, B>(
    fma: Kind2<URI, _, O.Option<A>>,
  ): (fmf: Kind2<URI, _, O.Option<(a: A) => B>>) => Kind2<URI, _, O.Option<B>>
}

interface Ap2PointFree<URI extends URIS2> {
  <_, A, B>(
    fma: Kind2<URI, _, O.Option<A>>,
  ): (fmf: Kind2<URI, _, O.Option<(a: A) => B>>) => Kind2<URI, _, O.Option<B>>
}

interface ApPointFree<URI extends URIS> {
  <A, B>(
    fma: Kind<URI, O.Option<A>>,
  ): (fmf: Kind<URI, O.Option<(a: A) => B>>) => Kind<URI, O.Option<B>>
}

export interface Ap2C<URI extends URIS2, E>
  extends Ap2CPointed<URI, E>,
    Ap2CPointFree<URI, E> {}

export interface Ap2<URI extends URIS2>
  extends Ap2Pointed<URI>,
    Ap2PointFree<URI> {}

export interface Ap<URI extends URIS>
  extends ApPointed<URI>,
    ApPointFree<URI> {}

export function ap<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): Ap2C<URI, E>
export function ap<URI extends URIS2>(applicative: Applicative2<URI>): Ap2<URI>
export function ap<URI extends URIS>(applicative: Applicative<URI>): Ap<URI>
export function ap<URI extends URIS>(applicative: Applicative<URI>): Ap<URI> {
  const apPointed: ApPointed<URI> = <A, B>(
    fmf: Kind<URI, O.Option<(a: A) => B>>,
    fma: Kind<URI, O.Option<A>>,
  ): Kind<URI, O.Option<B>> =>
    pipe (
      fmf,
      applicative.map (mf => (mg: O.Option<A>) => O.ap (mf, mg)),
      applicative.ap (fma),
    )

  return overload (1, apPointed)
}
