import * as NERA from "../../NonEmptyReadonlyArray"
import * as O from "../../Option"
import * as R from "../../Result"
import * as B from "../../Boolean"
import * as E from "../../../types/Eq"
import { Refinement } from "../../../types/utils"
import { Predicate } from "../../Predicate"
import { identity } from "../../Identity"
import { flatMap } from "../monad"
import { filterMap } from "../filterable"
import { constant, constEmptyArray } from "../../../utils/constant"
import { flow, pipe } from "../../../utils/flow"
import { match, matchLeft, matchRight } from "./matchers"
import { isNonEmpty } from "../refinements"
import { of } from "../applicative"

export const fromNonEmpty: {
  <A>(as: NERA.NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = identity

export const length: {
  <A>(self: ReadonlyArray<A>): number
} = self => self.length

export const copy: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = self => [...self]

export const head: {
  <A>(self: ReadonlyArray<A>): O.Option<A>
} = match (O.zero, flow (NERA.head, O.some))

export const init: {
  <A>(self: ReadonlyArray<A>): O.Option<ReadonlyArray<A>>
} = match (O.zero, flow (NERA.init, O.some))

export const last: {
  <A>(self: ReadonlyArray<A>): O.Option<A>
} = match (O.zero, flow (NERA.last, O.some))

export const tail: {
  <A>(self: ReadonlyArray<A>): O.Option<ReadonlyArray<A>>
} = match (O.zero, flow (NERA.tail, O.some))

export const lookup: {
  <A>(i: number): (self: ReadonlyArray<A>) => O.Option<A>
} = i => self =>
  i >= 0 && i < length (self) ? pipe (self.at (i)!, O.some) : O.none

/** Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on. */
export const at: {
  <A>(i: number): (self: ReadonlyArray<A>) => O.Option<A>
} = i => self =>
  i < length (self) && i >= -length (self) ? pipe (self.at (i)!, O.some) : O.none

export const isOutOfBounds: {
  <A>(i: number): (self: ReadonlyArray<A>) => boolean
} = i => self => !Object.hasOwn (self, Number (i))

export const findMap: {
  <A, B>(amb: (a: A) => O.Option<B>): (self: ReadonlyArray<A>) => O.Option<B>
} = amb =>
  matchLeft (O.zero, (head, tail) =>
    pipe (
      head,
      amb,
      O.match (() => findMap (amb) (tail), O.some),
    ),
  )

export const find: {
  <A, B extends A>(p: Refinement<A, B>): (self: ReadonlyArray<A>) => O.Option<B>
  <A>(p: Predicate<A>): (self: ReadonlyArray<A>) => O.Option<A>
} = <A>(p: Predicate<A>) =>
  findMap (a => pipe (a, p, B.match (O.zero, flow (constant (a), O.some))))

export const findIndex: {
  <A>(p: Predicate<A>): (self: ReadonlyArray<A>) => O.Option<number>
} = p => self =>
  pipe (
    self.findIndex (a => p (a)),
    i => i > -1 ? O.some (i) : O.none,
  )

export const findLastMap: {
  <A, B>(amb: (a: A) => O.Option<B>): (self: ReadonlyArray<A>) => O.Option<B>
} = amb =>
  matchRight (O.zero, (init, last) =>
    pipe (
      last,
      amb,
      O.match (() => findLastMap (amb) (init), O.some),
    ),
  )

export const findLast: {
  <A, B extends A>(p: Refinement<A, B>): (self: ReadonlyArray<A>) => O.Option<B>
  <A>(p: Predicate<A>): (self: ReadonlyArray<A>) => O.Option<A>
} = <A>(p: Predicate<A>) =>
  findLastMap (a => pipe (a, p, B.match (O.zero, flow (constant (a), O.some))))

export const findLastIndex: {
  <A>(p: Predicate<A>): (self: ReadonlyArray<A>) => O.Option<number>
} = p => self =>
  pipe (
    self.findLastIndex (a => p (a)),
    i => i > -1 ? O.some (i) : O.none,
  )

/** Is `a` element of an array by `Eq` instance */
export const elem =
  <A>(
    E: E.Eq<A>,
  ): {
    (a: A): (self: ReadonlyArray<A>) => boolean
  } =>
  a =>
    flow (find (E.equals (a)), O.isSome)

export const every: {
  <A, B extends A>(
    p: Refinement<A, B>,
  ): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(p: Predicate<A>): Predicate<ReadonlyArray<A>>
} =
  <A, B extends A>(p: Refinement<A, B>) =>
  (self: ReadonlyArray<A>) =>
    self.every (a => p (a))

export const exists =
  <A>(p: Predicate<A>) =>
  (self: ReadonlyArray<A>): self is NERA.NonEmptyReadonlyArray<A> =>
    self.some (a => p (a))

/** Alias for exists */
export const some = exists

export const failures: {
  <E, A>(self: ReadonlyArray<R.Result<E, A>>): ReadonlyArray<E>
} = flatMap (R.match (of, constEmptyArray))

export const successes: {
  <E, A>(self: ReadonlyArray<R.Result<E, A>>): ReadonlyArray<A>
} = flatMap (R.match (constEmptyArray, of))

export const prepend: {
  <A>(a: A): (self: ReadonlyArray<A>) => NERA.NonEmptyReadonlyArray<A>
} = a => self => NERA.concat (self) ([a])

export const prependAllWith: {
  <A>(f: (a: A) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap (x => [f (x), x])

export const prependAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow (constant, prependAllWith)

export const append: {
  <A>(a: A): (self: ReadonlyArray<A>) => NERA.NonEmptyReadonlyArray<A>
} = a => NERA.concat ([a])

export const appendAllWith: {
  <A>(f: (a: A) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap (x => [x, f (x)])

export const appendAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow (constant, appendAllWith)

export const range: {
  (from: number): (to: number) => NERA.NonEmptyReadonlyArray<number>
} = from => to =>
  from === to
    ? [from]
    : from < to
      ? prepend (from) (range (from + 1) (to))
      : prepend (from) (range (from - 1) (to))

export const reverse: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = self => self.toReversed ()

export const join: {
  (separator: string): (self: ReadonlyArray<string>) => string
} = separator => self => self.join (separator)

/** [f (a, b, ...) | a <- as, b <- bs, ..., p (a, b, ...)] */
export function comprehension<A, R>(
  input: readonly [ReadonlyArray<A>],
  f: (a: A) => R,
  p?: (a: A) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>],
  f: (a: A, b: B) => R,
  p?: (a: A, b: B) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, C, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>, ReadonlyArray<C>],
  f: (a: A, b: B, c: C) => R,
  p?: (a: A, b: B, c: C) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, C, D, R>(
  input: readonly [
    ReadonlyArray<A>,
    ReadonlyArray<B>,
    ReadonlyArray<C>,
    ReadonlyArray<D>,
  ],
  f: (a: A, b: B, c: C, d: D) => R,
  p?: (a: A, b: B, c: C, d: D) => boolean,
): ReadonlyArray<R>
export function comprehension(
  input: ReadonlyArray<ReadonlyArray<unknown>>,
  f: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => unknown,
  p: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => boolean = constant (
    true,
  ),
): ReadonlyArray<unknown> {
  const getArgs: {
    (
      args: ReadonlyArray<unknown>,
    ): (input: ReadonlyArray<ReadonlyArray<unknown>>) => ReadonlyArray<unknown>
  } = args => input =>
    isNonEmpty (input)
      ? pipe (
          input,
          NERA.head,
          flatMap (x => pipe (input, NERA.tail, getArgs (append (x) (args)))),
        )
      : [args]

  return pipe (
    input,
    getArgs ([]),
    filterMap ((args: readonly [unknown]) =>
      isNonEmpty (args)
        ? p (...args)
          ? pipe (f (...args), O.some)
          : O.none
        : // If some of input arrays is empty, then whole result should be an empty array
          O.none,
    ),
  )
}
