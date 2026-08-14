import { ArchivedFormulaRepository } from '@/archived-formula/repositories';
import { ArchivedPigeonRepository } from '@/archived-pigeon/repositories';
import { FormulaRepository } from '@/formula/repositories';
import { NewsService } from '@/news/services';
import { PigeonRepository } from '@/pigeon/repositories';
import { UserRepository } from '@/user/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminOverviewService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly pigeonRepository: PigeonRepository,
    private readonly formulaRepository: FormulaRepository,
    private readonly archivedPigeonRepository: ArchivedPigeonRepository,
    private readonly archivedFormulaRepository: ArchivedFormulaRepository,
    private readonly newsService: NewsService,
  ) {}

  async getOverviewMetrics(): Promise<{
    totalUsers: number;
    totalPigeons: number;
    totalFormulas: number;
    totalArchivedPigeons: number;
    totalArchivedFormulas: number;
    totalNewsItems: number;
  }> {
    const [users, totalPigeons, totalFormulas, totalArchivedPigeons, totalArchivedFormulas, news] =
      await Promise.all([
        this.userRepository.findAll(),
        this.pigeonRepository.countAllAcrossUsers(),
        this.formulaRepository.countAllAcrossUsers(),
        this.archivedPigeonRepository.countAllAcrossUsers(),
        this.archivedFormulaRepository.countAllAcrossUsers(),
        this.newsService.findAll(),
      ]);

    return {
      totalUsers: users.length,
      totalPigeons,
      totalFormulas,
      totalArchivedPigeons,
      totalArchivedFormulas,
      totalNewsItems: news.length,
    };
  }
}
