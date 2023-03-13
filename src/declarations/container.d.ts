export type IdentifiedContainer = { id: string }
export type MappedContainer<T> = { [id: string]: T }
export type ParsedContainer<T> = MappedContainer<T & {id: string}>
