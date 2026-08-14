import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EmailService } from '@/auth/services/email.service';
import { ReportReason } from '../dto/requests/report-news-item.request.dto';
import { CreateNewsItemRequestDto, UpdateNewsItemRequestDto } from '../dto/requests';
import { NewsItem, NewsReport } from '../entities';
import { NewsRepository, NewsReportRepository } from '../repositories';
import { hasObjectionableContent } from '../utils/content-filter';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsReportRepository: NewsReportRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateNewsItemRequestDto): Promise<NewsItem> {
    if (hasObjectionableContent(dto.description)) {
      throw new BadRequestException('Objectionable content is not allowed');
    }
    return this.newsRepository.create(dto);
  }

  async findAll(userId?: string): Promise<NewsItem[]> {
    const items = await this.newsRepository.findAll();
    if (!userId) return items;
    const reports = await this.newsReportRepository.findByUserId(userId);
    const hidden = new Set(reports.map((r) => r.newsItemId));
    return items.filter((item) => !hidden.has(item.id));
  }

  async findById(id: string): Promise<NewsItem> {
    const item = await this.newsRepository.findById(id);
    if (!item) {
      throw new NotFoundException('News item not found');
    }
    return item;
  }

  async update(id: string, dto: UpdateNewsItemRequestDto): Promise<NewsItem> {
    await this.findById(id);
    if (dto.description != null && hasObjectionableContent(dto.description)) {
      throw new BadRequestException('Objectionable content is not allowed');
    }
    const data: Partial<NewsItem> = {
      ...(dto.type != null && { type: dto.type }),
      ...(dto.dateTime != null && { dateTime: new Date(dto.dateTime) }),
      ...(dto.description != null && { description: dto.description }),
    };
    const updated = await this.newsRepository.update(id, data);
    if (!updated) throw new NotFoundException('News item not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.newsRepository.delete(id);
  }

  async report(newsItemId: string, reportedByUserId: string, reason: ReportReason): Promise<NewsReport> {
    await this.findById(newsItemId);
    const report = await this.newsReportRepository.create(newsItemId, reportedByUserId, reason);
    this.emailService
      .sendContentModerationAlert({
        newsItemId,
        reportedByUserId,
        reason,
      })
      .catch((error) => this.logger.warn(`Failed to send moderation email: ${error?.message}`));
    return report;
  }
}
