import { FirebaseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { NEWS_CONSTANTS } from '../constants';
import { ReportReason } from '../dto/requests/report-news-item.request.dto';
import { NewsReport } from '../entities/news-report.entity';

@Injectable()
export class NewsReportRepository {
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(NEWS_CONSTANTS.REPORTS_COLLECTION);
  }

  async create(newsItemId: string, reportedByUserId: string, reason: ReportReason): Promise<NewsReport> {
    const id = uuidv4();
    const report: NewsReport = {
      id,
      newsItemId,
      reportedByUserId,
      reason,
      createdAt: moment().toDate(),
    };

    await this.collectionRef.child(id).set({
      ...report,
      createdAt: report.createdAt.toISOString(),
    });

    return report;
  }

  async findByNewsItemId(newsItemId: string): Promise<NewsReport[]> {
    const snapshot = await this.collectionRef
      .orderByChild('newsItemId')
      .equalTo(newsItemId)
      .once('value');

    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];

    return Object.values(data as Record<string, any>).map((r) => ({
      ...r,
      createdAt: moment(r.createdAt).toDate(),
    }));
  }

  async findByUserId(userId: string): Promise<NewsReport[]> {
    const snapshot = await this.collectionRef.once('value');
    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];

    return Object.values(data as Record<string, any>)
      .filter((r) => r?.reportedByUserId === userId)
      .map((r) => ({
        ...r,
        createdAt: moment(r.createdAt).toDate(),
      }));
  }
}
