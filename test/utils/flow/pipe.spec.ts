import { concat } from "../../../src/modules/String"
import { pipe } from "../../../src/utils/flow"

describe ("pipe", () => {
  it ("should return its own argument", () => {
    const x = "a"
    expect (pipe (x)).toBe (x)
  })

  it ("should correctly apply first argument to the function of second", () => {
    const f = jest.fn (concat ("b"))
    expect (pipe ("a", f)).toBe (f ("a"))
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly apply result of the previous function execution to the next function", () => {
    const f = jest.fn (concat ("b"))
    const g = jest.fn (concat ("c"))
    expect (pipe ("a", f, g)).toBe (g (f ("a")))
    expect (f).toHaveBeenCalledTimes (2)
    expect (g).toHaveBeenCalledTimes (2)
  })
})
