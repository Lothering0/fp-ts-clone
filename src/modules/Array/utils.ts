import * as NEA from "../NonEmptyArray"
import * as O from "../Option"
import { flatMap } from "./monad"
import { filterMap } from "./filterable"
import { overload, overload2, overloadLast } from "../../utils/overloads"
import { constant } from "../../utils/constant"
import { pipe } from "../../utils/flow"
import { LazyArg } from "../../types/utils"

type Length = <A>(as: A[]) => number
export const length: Length = as => as.length

export const isEmpty = <A>(as: A[]): as is [] => length (as) === 0

export const isNonEmpty = <A>(as: A[]): as is NEA.NonEmptyArray<A> =>
  !isEmpty (as)

type Copy = <A>(as: A[]) => A[]
export const copy: Copy = as => [...as]

interface MatchPointed {
  <A, B>(
    as: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): B
}

interface Match extends MatchPointed {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (as: A[]) => B
}

const matchPointed: MatchPointed = (as, whenEmpty, whenNonEmpty) =>
  isNonEmpty (as) ? whenNonEmpty (as) : whenEmpty ()

export const match: Match = overload2 (matchPointed)

type Head = <A>(as: A[]) => O.Option<A>
export const head: Head = as =>
  isNonEmpty (as) ? pipe (as, NEA.head, O.some) : O.none

type Init = <A>(as: A[]) => O.Option<A[]>
export const init: Init = as =>
  isNonEmpty (as) ? pipe (as, NEA.init, O.some) : O.none

type Last = <A>(as: A[]) => O.Option<A>
export const last: Last = as =>
  isNonEmpty (as) ? pipe (as, NEA.last, O.some) : O.none

type Tail = <A>(as: A[]) => O.Option<A[]>
export const tail: Tail = as =>
  isNonEmpty (as) ? pipe (as, NEA.tail, O.some) : O.none

interface PrependPointed {
  <A>(a: A, as: A[]): NEA.NonEmptyArray<A>
}

interface PrependPointFree {
  <A>(a: A): (as: A[]) => NEA.NonEmptyArray<A>
}

interface Prepend extends PrependPointed, PrependPointFree {}

const prependPointed: PrependPointed = (a, as) => [a, ...as]
export const prepend: Prepend = overloadLast (prependPointed)

interface PrependAllWithPointed {
  <A>(f: (a: A) => A, as: A[]): A[]
}

interface PrependAllWithPointFree {
  <A>(f: (a: A) => A): (as: A[]) => A[]
}

interface PrependAllWith
  extends PrependAllWithPointed,
    PrependAllWithPointFree {}

const prependAllWithPointed: PrependAllWithPointed = (f, as) =>
  flatMap (as, x => [f (x), x])
export const prependAllWith: PrependAllWith = overloadLast (
  prependAllWithPointed,
)

interface PrependAllPointed {
  <A>(a: A, as: A[]): A[]
}

interface PrependAllPointFree {
  <A>(a: A): (as: A[]) => A[]
}

interface PrependAll extends PrependAllPointed, PrependAllPointFree {}

const prependAllPointed: PrependAllPointed = <A>(a: A, as: A[]) =>
  prependAllWith (constant (a), as)
export const prependAll: PrependAll = overloadLast (prependAllPointed)

interface AppendPointed {
  <A>(as: A[], a: A): NEA.NonEmptyArray<A>
}

interface AppendPointFree {
  <A>(a: A): (as: A[]) => NEA.NonEmptyArray<A>
}

interface Append extends AppendPointed, AppendPointFree {}

const appendPointed: AppendPointed = <A>(as: A[], a: A) =>
  [...as, a] as unknown as NEA.NonEmptyArray<A>
export const append: Append = overload (appendPointed)

interface AppendAllWithPointed {
  <A>(as: A[], f: (a: A) => A): A[]
}

interface AppendAllWithPointFree {
  <A>(f: (a: A) => A): (as: A[]) => A[]
}

interface AppendAllWith extends AppendAllWithPointed, AppendAllWithPointFree {}

const appendAllWithPointed: AppendAllWithPointed = (as, f) =>
  flatMap (as, x => [x, f (x)])
export const appendAllWith: AppendAllWith = overload (appendAllWithPointed)

interface AppendAllPointed {
  <A>(as: A[], a: A): A[]
}

interface AppendAllPointFree {
  <A>(a: A): (as: A[]) => A[]
}

interface AppendAll extends AppendAllPointed, AppendAllPointFree {}

const appendAllPointed: AppendAllPointed = (as, a) =>
  appendAllWith (as, constant (a))
export const appendAll: AppendAll = overload (appendAllPointed)

type Range = (from: number) => (to: number) => NEA.NonEmptyArray<number>
export const range: Range = from => to =>
  from === to
    ? [from]
    : from < to
      ? [from, ...range (from + 1) (to)]
      : [from, ...range (from - 1) (to)]

type Reverse = <A>(a: A[]) => A[]
export const reverse: Reverse = as => as.toReversed ()

interface ConcatPointed {
  <A>(start: A[], end: A[]): A[]
}

interface ConcatPointFree {
  <A>(end: A[]): (start: A[]) => A[]
}

interface Concat extends ConcatPointed, ConcatPointFree {}

export const concat: Concat = NEA.concat

/** [f (a, b, ...) | a <- as, b <- bs, ..., p (a, b, ...)] */
export function comprehension<A, R>(
  input: [A[]],
  f: (a: A) => R,
  p?: (a: A) => boolean,
): R[]
export function comprehension<A, B, R>(
  input: [A[], B[]],
  f: (a: A, b: B) => R,
  p?: (a: A, b: B) => boolean,
): R[]
export function comprehension<A, B, C, R>(
  input: [A[], B[], C[]],
  f: (a: A, b: B, c: C) => R,
  p?: (a: A, b: B, c: C) => boolean,
): R[]
export function comprehension<A, B, C, D, R>(
  input: [A[], B[], C[], D[]],
  f: (a: A, b: B, c: C, d: D) => R,
  p?: (a: A, b: B, c: C, d: D) => boolean,
): R[]
export function comprehension(
  input: unknown[][],
  f: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => unknown,
  p: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => boolean = constant (
    true,
  ),
): unknown[] {
  type GetArgs = (args: unknown[]) => (input: unknown[][]) => unknown[]
  const getArgs: GetArgs = args => input =>
    isNonEmpty (input)
      ? pipe (
          input,
          NEA.head,
          flatMap (x => pipe (input, NEA.tail, getArgs (append (x) (args)))),
        )
      : [args]

  return pipe (
    input,
    getArgs ([]),
    filterMap ((args: [unknown]) =>
      isNonEmpty (args)
        ? p (...args)
          ? pipe (f (...args), O.some)
          : O.none
        : // If some of input arrays is empty, then whole result should be an empty array
          O.none,
    ),
  )
}
