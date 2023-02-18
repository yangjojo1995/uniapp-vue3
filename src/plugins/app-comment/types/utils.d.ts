declare interface ListInterface {
  current: number,
  size: number,
  total: number
}

declare interface ListParams {
  page: number,
  size: number,
  sortField?: string,
  asc?: boolean
}
