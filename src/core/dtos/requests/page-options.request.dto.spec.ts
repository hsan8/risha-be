import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PageOptionsRequestDto } from './page-options.request.dto';

describe('PageOptionsRequestDto', () => {
  describe('page', () => {
    it('should be optional (default 1)', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, {});
      const errors = validateSync(pageOptions);

      expect(errors).toEqual([]);
      expect(pageOptions.page).toEqual(1);
    });

    it('should transform to number', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { page: '2' });
      const errors = validateSync(pageOptions);

      expect(errors).toEqual([]);
      expect(pageOptions.page).toEqual(2);
    });

    it('should be number only', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { page: 'abc' });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('page');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should be an integer only', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { page: 1.5 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('page');
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should be minimum of 1', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { page: 0 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('page');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should be maximum of 1_000_000_000_000', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: 1_000_000_000_001 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('size');
      expect(errors[0].constraints).toHaveProperty('max');
    });
  });

  describe('size', () => {
    it('should be optional (default 10)', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, {});
      const errors = validateSync(pageOptions);

      expect(errors).toEqual([]);
      expect(pageOptions.size).toEqual(10);
    });

    it('should transform to number', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: '2' });
      const errors = validateSync(pageOptions);

      expect(errors).toEqual([]);
      expect(pageOptions.size).toEqual(2);
    });

    it('should be number only', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: 'abc' });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('size');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should be an integer only', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: 1.5 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('size');
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should be minimum of 1', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: 0 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('size');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should be maximum of 50', () => {
      const pageOptions = plainToInstance(PageOptionsRequestDto, { size: 51 });
      const errors = validateSync(pageOptions);

      expect(errors[0].property).toEqual('size');
      expect(errors[0].constraints).toHaveProperty('max');
    });
  });
});
