import { IPagination } from '@config/pagination'

export interface ICandy {
  id: string
  name: string
  description: string | null
  price: string
}

export interface IListCandy extends IPagination {
  candies: ICandy[]
}
