import { _URI } from "./array"
import {
  createFilterableWithIndex,
  FilterableWithIndex,
} from "src/types/FilterableWithIndex"
import { createFilterable, Filterable } from "../../types/Filterable"
import { compactable } from "./compactable"
import { functor, functorWithIndex } from "./functor"

export const filterable: Filterable<typeof _URI> = createFilterable ({
  ...compactable,
  ...functor,
})

export const filterableWithIndex: FilterableWithIndex<typeof _URI, number> =
  createFilterableWithIndex ({
    ...filterable,
    ...functorWithIndex,
  })

export const {
  filterMap,
  filterMapWithIndex,
  filter,
  filterWithIndex,
  partitionMap,
  partitionMapWithIndex,
  partition,
  partitionWithIndex,
} = filterableWithIndex
