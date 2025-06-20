/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Overloads `(point, a) => b` with `a => point => b`
 */
export const overload =
  (pointed: (...args: [any, any]) => any) =>
  (a: any, b?: any): any =>
    typeof b === "undefined" ? (b: any) => pointed (b, a) : pointed (a, b)

/**
 * Overloads `(a, point) => b` with `a => point => b`
 */
export const overloadLast =
  (pointed: (...args: [any, any]) => any) =>
  (a: any, b?: any): any =>
    typeof b === "undefined" ? (b: any) => pointed (a, b) : pointed (a, b)

/**
 * Overloads `(point, a, b) => c` with `(a, b) => point => c`
 */
export const overload2 =
  (pointed: (...args: [any, any, any]) => any) =>
  (a: any, b: any, c?: any): any =>
    typeof c === "undefined" ? (c: any) => pointed (c, a, b) : pointed (a, b, c)

/**
 * Overloads `(a, b, point) => c` with `(a, b) => point => c`
 */
export const overloadLast2 =
  (pointed: (...args: [any, any, any]) => any) =>
  (a: any, b: any, c?: any): any =>
    typeof c === "undefined" ? (c: any) => pointed (a, b, c) : pointed (a, b, c)
