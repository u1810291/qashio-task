import { DynamicModule, Module } from '@nestjs/common'

import { Symbols } from '@domain/symbols'
import { UserRepositoryI } from '@domain/repositories/userRepository.interface'

import { EnvironmentConfigModule } from '@config/environment-config/environment-config.module'
import { EnvironmentConfigService } from '@config/environment-config/environment-config.service'

import { LoginUseCases } from '@usecases/auth/login.usecases'
import { LogoutUseCases } from '@usecases/auth/logout.usecases'
import { RegisterUseCases } from '@usecases/auth/register.usecases'
import { GetUserByEmail } from '@usecases/user/GetUserByEmail.usecase'
import { IsAuthenticatedUseCases } from '@usecases/auth/is-authenticated.usecases'

import { LoggerModule } from '@infrastructure/logger/logger.module'
import { JwtModule } from '@infrastructure/services/jwt/jwt.module'
import { LoggerService } from '@infrastructure/logger/logger.service'
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service'
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy'
import { BcryptModule } from '@infrastructure/services/bcrypt/bcrypt.module'
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service'
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module'
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module'
import { DatabaseUserRepository } from '@infrastructure/repositories/user.repository'

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UseCasesProxyModule {
  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [DatabaseUserRepository],
          provide: Symbols.REGISTER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) => new UseCaseProxy(new RegisterUseCases(userRepo)),
        },
        {
          inject: [LoggerService, JwtTokenService, EnvironmentConfigService, DatabaseUserRepository, BcryptService],
          provide: Symbols.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: UserRepositoryI,
            bcryptService: BcryptService,
          ) => new UseCaseProxy(new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: Symbols.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: UserRepositoryI) => new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: Symbols.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: Symbols.GET_USER_BY_EMAIL_USECASES_PROXY,
          useFactory: (logger: LoggerService, userRepository: UserRepositoryI) =>
            new UseCaseProxy(new GetUserByEmail(logger, userRepository)),
        },
      ],
      exports: [
        Symbols.LOGIN_USECASES_PROXY,
        Symbols.LOGOUT_USECASES_PROXY,
        Symbols.REGISTER_USECASES_PROXY,
        Symbols.IS_AUTHENTICATED_USECASES_PROXY,
      ],
    }
  }
}
