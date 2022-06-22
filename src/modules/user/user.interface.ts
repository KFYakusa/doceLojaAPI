import { IPagination } from '@config/pagination'
export interface IUser {
  id?: string
  name?: string | null
  email: string
  password: string
}

export interface IListUser extends IPagination {
  users: IUser[]
}
