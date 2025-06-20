import * as Io from "../Io"
import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Task: Task<A>
  }
}

export interface Task<A> extends Io.Io<Promise<A>> {}

export const URI = "Task" satisfies URIS
export type URI = typeof URI

type TaskConstructor = <A>(a: A) => Task<A>
export const task: TaskConstructor = a => () => Promise.resolve (a)

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()
