import { isNotEmpty } from 'class-validator'
import { ICandy } from './candy.interface'

export class CreateCandyRequest {
  @isNotEmpty()
  name: string

  @isNotEmpty()
  price: string

  description: string
}
