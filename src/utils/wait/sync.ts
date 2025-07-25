import * as S from "../../modules/Sync"
import { Predicate } from "../../modules/Predicate"
import { getDoWhile } from "../loops"
import { now } from "../time"
import { _ } from "../underscore"

export const wait_: {
  (ms: number): S.Sync<void>
} = ms => {
  const start = S.execute (now)
  const predicate: Predicate<void> = () => S.execute (now) - start < ms
  const doWhile_ = getDoWhile (S.Applicative)

  return doWhile_ (predicate) (() => _)
}
