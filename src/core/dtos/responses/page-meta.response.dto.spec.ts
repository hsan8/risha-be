import { PageMetaResponseDto } from './page-meta.response.dto';

describe('PageMetaResponseDto', () => {
  it('should initialize the PageMetaResponseDto instance correctly', () => {
    const pageMeta = new PageMetaResponseDto({ page: 1, size: 10, itemCount: 15 });

    expect(pageMeta).toEqual({
      page: 1,
      size: 10,
      itemCount: 15,
      pageCount: 2,
      hasPreviousPage: false,
      hasNextPage: true,
    });
  });

  it('should set hasPreviousPage and hasNextPage properly', () => {
    const pageMeta = new PageMetaResponseDto({ page: 2, size: 10, itemCount: 15 });

    expect(pageMeta).toEqual({
      page: 2,
      size: 10,
      itemCount: 15,
      pageCount: 2,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });

  it('should set hasNextPage to false if page is equal to pageCount', () => {
    const pageMeta = new PageMetaResponseDto({ page: 2, size: 7, itemCount: 14 });

    expect(pageMeta).toEqual({
      page: 2,
      size: 7,
      itemCount: 14,
      pageCount: 2,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });

  it('should handle zero itemCount correctly', () => {
    const pageMeta = new PageMetaResponseDto({ page: 1, size: 10, itemCount: 0 });

    expect(pageMeta).toEqual({
      page: 1,
      size: 10,
      itemCount: 0,
      pageCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });
});
