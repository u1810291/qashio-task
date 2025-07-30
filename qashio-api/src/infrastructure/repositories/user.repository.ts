import { Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@config/prisma/prisma.service'
import { UserRepositoryI } from '@domain/repositories/userRepository.interface'

import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service'
import { PrismaRepository } from '@infrastructure/repositories/prisma.repository'
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service'


@Injectable()
export class DatabaseUserRepository extends PrismaRepository<'users'> implements UserRepositoryI {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly exceptionService: ExceptionsService,
    private readonly encrypt: BcryptService,
  ) {
    super(prisma, 'users')
  }

  async updateLastLogin(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.update({
      where: {
        email: email,
      },
      data: {
        hashRefreshToken: refreshToken,
      },
    })
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    const adminUserEntity = await this.findFirst({
      where: {
        email: email,
      },
    })
    if (!adminUserEntity) {
      return null
    }
    return adminUserEntity
  }

  async register(user: Pick<Users, 'email' | 'name' | 'password'>): Promise<Users> {
    const userExists = await this.findFirst({
      where: {
        email: user.email,
      },
    })

    if (userExists) {
      this.exceptionService.badRequestException({
        code_error: 400,
        message: 'User with this email is already exists',
      })
    }

    const password = await this.encrypt.hash(user.password)

    const userRegister = await this.create({
      data: {
        name: user.name,
        email: user.email,
        password: password,
      },
    })
    return userRegister
  }
}
