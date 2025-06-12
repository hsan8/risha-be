import { PageDto, PageMetaDto, PageOptionsDto } from '../dtos';

export class ResponseBuilder {
  static buildMultipleWithPaginated<T>(data: T[], itemCount: number, options: PageOptionsDto): PageDto<T> {
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: options });
    return new PageDto<T>(data, pageMetaDto);
  }

  static buildSingle<T>(singleObject: T): { data: T } {
    return { data: { ...singleObject } };
  }
}
