import * as AO from "../../../src/modules/AsyncOption"
import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: AO.AsyncOption<typeof x> = jest.fn (AO.of (x))

      const result = await pipe (fa, AO.map (identity), AO.toPromise)
      expect (result).toEqual<O.Option<typeof x>> (O.some (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => AO.of<typeof x> (x)

      const fa1: AO.AsyncOption<typeof x> = jest.fn (getFa ())
      const fa2: AO.AsyncOption<typeof x> = jest.fn (getFa ())

      const result1 = await pipe (
        fa1,
        AO.map (a => bc (ab (a))),
        AO.toPromise,
      )
      const result2 = await pipe (fa2, AO.map (ab), AO.map (bc), AO.toPromise)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `none` if the same was provided", async () => {
      const n = 1
      const fa: AO.AsyncOption<never> = jest.fn (AO.none)
      const result = await pipe (fa, AO.map (N.add (n)), AO.toPromise)
      expect (result).toEqual<O.Option<never>> (O.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `some` if it was provided", async () => {
      const x = 1
      const n = 1
      const fa: AO.AsyncOption<typeof x> = jest.fn (AO.some (x))
      const result = await pipe (fa, AO.map (N.add (n)), AO.toPromise)
      expect (result).toEqual (O.some (N.add (x) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
