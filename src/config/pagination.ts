export const defaultLimit = 100
export const defaultPage = 1

export enum EOrderBy {
  ASC = 'asc',
  DESC = 'desc'
}

export interface IPagination {
  page: number
  limit: number
  totalPages: number
}
