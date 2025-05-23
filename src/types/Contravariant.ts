import { HKT } from "./HKT"
import { URIS } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

export interface Contravariant<URI extends URIS> {
  readonly _URI: URI
  readonly contramap: Contramap<URI>
}

type CreateContravariant = <URI extends URIS>(
  functor: CreateContravariantArg<URI>,
) => Contravariant<URI>
export const createContravariant: CreateContravariant = contravariant => ({
  ...contravariant,
  contramap: overloadWithPointFree (contravariant.contramap),
})

interface CreateContravariantArg<URI extends URIS>
  extends Omit<Contravariant<URI>, "contramap"> {
  readonly contramap: ContramapPointed<URI>
}

interface ContramapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, f: (b: B) => A): HKT<URI, B>
}

interface Contramap<URI extends URIS> extends ContramapPointed<URI> {
  <A, B>(f: (b: B) => A): (fa: HKT<URI, A>) => HKT<URI, B>
}
