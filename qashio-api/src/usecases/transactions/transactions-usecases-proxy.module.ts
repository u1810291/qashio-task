import { DynamicModule, Module } from '@nestjs/common'

import { GetUserByEmail } from '@usecases/transactions/create-transaction.usecases'

import { Symbols } from '@domain/symbols'
import { TransactionRepositoryI } from '@domain/repositories/transaction-repository.interface'

import { LoggerModule } from '@infrastructure/logger/logger.module'
import { LoggerService } from '@infrastructure/logger/logger.service'
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy'
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module'
import { DatabaseTransactionRepository } from '@infrastructure/repositories/transaction.repository'

@Module({
  imports: [LoggerModule, RepositoriesModule],
})
export class TransactionsUseCasesProxyModule {
  static register(): DynamicModule {
    return {
      module: TransactionsUseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, DatabaseTransactionRepository],
          provide: Symbols.CREATE_TRANSACTION_USECASES_PROXY,
          useFactory: (logger: LoggerService, repo: TransactionRepositoryI) =>
            new UseCaseProxy(new GetUserByEmail(logger, repo)),
        },
        {
          inject: [LoggerService, DatabaseTransactionRepository],
          provide: Symbols.READ_TRANSACTION_USECASES_PROXY,
          useFactory: (logger: LoggerService, repo: TransactionRepositoryI) =>
            new UseCaseProxy(new GetUserByEmail(logger, repo)),
        },
        {
          inject: [LoggerService, DatabaseTransactionRepository],
          provide: Symbols.UPDATE_TRANSACTION_USECASES_PROXY,
          useFactory: (logger: LoggerService, repo: TransactionRepositoryI) =>
            new UseCaseProxy(new GetUserByEmail(logger, repo)),
        },
        {
          inject: [LoggerService, DatabaseTransactionRepository],
          provide: Symbols.DELETE_TRANSACTION_USECASES_PROXY,
          useFactory: (logger: LoggerService, repo: TransactionRepositoryI) =>
            new UseCaseProxy(new GetUserByEmail(logger, repo)),
        },
      ],
      exports: [
        Symbols.CREATE_TRANSACTION_USECASES_PROXY,
        Symbols.READ_TRANSACTION_USECASES_PROXY,
        Symbols.UPDATE_TRANSACTION_USECASES_PROXY,
        Symbols.DELETE_TRANSACTION_USECASES_PROXY
      ],
    }
  }
}
