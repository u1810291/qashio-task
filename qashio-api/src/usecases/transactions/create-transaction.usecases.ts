import { Transaction } from '@prisma/client'
import { ILogger } from '@domain/logger/logger.interface'
import { TransactionRepositoryI } from '@domain/repositories/transaction-repository.interface'

export class GetUserByEmail {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionRepository: TransactionRepositoryI,
  ) { }

  async execute(data: Transaction): Promise<Transaction | null> {
    const result = await this.transactionRepository.createTransaction(data)
    this.logger.log('CreateTransactionUseCases execute', 'New transaction has been inserted')
    return result
  }
}
