import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsItemRequestDto, UpdateNewsItemRequestDto } from '../dto/requests';
import { NewsItem } from '../entities';
import { NewsRepository } from '../repositories';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async create(dto: CreateNewsItemRequestDto): Promise<NewsItem> {
    return this.newsRepository.create(dto);
  }

  async findAll(): Promise<NewsItem[]> {
    return this.newsRepository.findAll();
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
}
