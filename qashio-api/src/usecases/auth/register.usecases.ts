import { UserRepositoryI } from '@domain/repositories/userRepository.interface'
import { Users } from '@prisma/client'

export class RegisterUseCases {
  constructor(private readonly userRepository: UserRepositoryI) { }

  async execute(user: Pick<Users, 'email' | 'name' | 'password'>): Promise<Users> {
    return this.userRepository.register(user)
  }
}
