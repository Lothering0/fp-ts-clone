import * as F from "../../types/Foldable"
import * as FI from "../../types/FoldableWithIndex"
import { ArrayHKT } from "./array"
import { overload } from "../../utils/overloads"

export const Foldable: F.Foldable<ArrayHKT> = {
  reduce: overload (
    2,
    <A, B>(self: A[], b: B, bab: (b: B, a: A) => B): B =>
      self.reduce ((b, a) => bab (b, a), b),
  ),
  reduceRight: overload (
    2,
    <A, B>(self: A[], b: B, abb: (a: A, b: B) => B): B =>
      self.reduceRight ((b, a) => abb (a, b), b),
  ),
}

export const FoldableWithIndex: FI.FoldableWithIndex<ArrayHKT, number> = {
  ...Foldable,
  reduceWithIndex: overload (
    2,
    <A, B>(self: A[], b: B, ibab: (i: number, b: B, a: A) => B): B =>
      self.reduce ((b, a, i) => ibab (i, b, a), b),
  ),
  reduceRightWithIndex: overload (
    2,
    <A, B>(self: A[], b: B, iabb: (i: number, a: A, b: B) => B): B =>
      self.reduceRight ((b, a, i) => iabb (i, a, b), b),
  ),
}

export const { reduce, reduceRight, reduceWithIndex, reduceRightWithIndex } =
  FoldableWithIndex
