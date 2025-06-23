import { DataPageResponseDto } from './data-page.response.dto';
import { PageMetaResponseDto } from './page-meta.response.dto';

describe('DataPageResponseDto', () => {
  it('should initialize the DataPageResponseDto instance correctly', () => {
    const testData = [{ id: 1 }, { id: 2 }];
    const testMeta = new PageMetaResponseDto({ page: 1, size: 2, itemCount: 5 });

    const dataPage = new DataPageResponseDto(testData, testMeta);

    expect(dataPage).toEqual({
      data: testData,
      meta: testMeta,
    });
  });
});
