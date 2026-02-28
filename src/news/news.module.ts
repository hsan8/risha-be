import { AuthModule } from '@/auth/auth.module';
import { ServicesModule } from '@/core/modules';
import { Module } from '@nestjs/common';
import { NewsController } from './controllers';
import { NewsRepository } from './repositories';
import { NewsService } from './services';

@Module({
  imports: [ServicesModule, AuthModule],
  controllers: [NewsController],
  providers: [NewsRepository, NewsService],
  exports: [NewsService],
})
export class NewsModule {}
