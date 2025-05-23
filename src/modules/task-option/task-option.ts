import * as T from "../task"
import * as TE from "../task-either"
import * as E from "../either"
import * as O from "../option"
import { URIS } from "../../types/Kind"
import { identity } from "../identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly TaskOption: TaskOption<A>
  }
}

export interface TaskOption<A> extends T.Task<O.Option<A>> {}

export const _URI = "TaskOption" satisfies URIS

type NoneConstructor = TaskOption<never>
export const none: NoneConstructor = T.of (O.none)

type SomeConstructor = <A>(a: A) => TaskOption<A>
export const some: SomeConstructor = flow (O.some, T.of)

type ToTaskOptionFromTask = <A>(ma: T.Task<A>) => TaskOption<A>
export const toTaskOptionFromTask: ToTaskOptionFromTask = ma => () =>
  ma ().then (O.some, () => O.none)

type ToTaskOptionFromTaskEither = <E, A>(
  ma: TE.TaskEither<E, A>,
) => TaskOption<A>
export const toTaskOptionFromTaskEither: ToTaskOptionFromTaskEither =
  ma => () =>
    ma ().then (E.either (constant (O.none), O.some), constant (O.none))

type FromTaskOption = <A>(ma: TaskOption<A>) => Promise<O.Option<A>>
export const fromTaskOption: FromTaskOption = mma =>
  mma ().then (identity, constant (O.none))

interface TaskOptionEliminatorPointed {
  <A, B>(
    mma: TaskOption<A>,
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): T.Task<B>
}

interface TaskOptionEliminator extends TaskOptionEliminatorPointed {
  <A, B>(
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): (mma: TaskOption<A>) => T.Task<B>
}

const taskOptionPointed: TaskOptionEliminatorPointed = (mma, f, g) => () =>
  fromTaskOption (mma).then (O.option (f, g))

export const taskOption: TaskOptionEliminator =
  overloadWithPointFree2 (taskOptionPointed)
