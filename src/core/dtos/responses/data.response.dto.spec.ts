import { DataResponseDto } from './data.response.dto';

describe('DataResponseDto', () => {
  it('should initialize the DataResponseDto instance correctly', () => {
    const testData = { foo: 'bar' };

    const dataResponse = new DataResponseDto(testData);

    expect(dataResponse).toEqual({
      data: testData,
    });
  });
});
