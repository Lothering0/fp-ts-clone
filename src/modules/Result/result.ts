import { HKT } from "../../types/HKT"

export interface ResultHKT extends HKT {
  readonly type: Result<this["_E"], this["_A"]>
}

export declare const _F: ResultHKT

export type Result<E, A> = Failure<E> | Success<A>

export interface Failure<E> {
  readonly _tag: "Failure"
  readonly failure: E
}

export interface Success<A> {
  readonly _tag: "Success"
  readonly success: A
}

export const failure: {
  <E = never, A = never>(e: E): Result<E, A>
} = value => ({
  _tag: "Failure",
  failure: value,
})

export const success: {
  <E = never, A = never>(a: A): Result<E, A>
} = value => ({
  _tag: "Success",
  success: value,
})
