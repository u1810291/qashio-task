import { Module } from '@nestjs/common';
import { UseCasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { Health } from './health/health.controller';
import { AuthUseCasesProxyModule } from '@usecases/auth/auth-usecases-proxy.module';

@Module({
  imports: [AuthUseCasesProxyModule.register()],
  controllers: [AuthController, Health],
})
export class ControllersModule {}
