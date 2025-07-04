import { LazyArg } from "../types/utils"
import * as E from "../modules/Either"

type Raise = <A>(a: A) => never
export const raise: Raise = a => {
  throw a
}

type TryDo = <E, A>(f: LazyArg<A>) => E.Either<E, A>
export const tryDo: TryDo = <E, A>(f: LazyArg<A>) => {
  try {
    return E.right (f ())
  } catch (exception) {
    return E.left (exception as E)
  }
}
