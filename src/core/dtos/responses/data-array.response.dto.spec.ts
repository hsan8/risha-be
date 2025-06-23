import { DataArrayResponseDto } from './data-array.response.dto';

describe('DataArrayResponseDto', () => {
  it('should initialize the DataArrayResponseDto instance correctly', () => {
    const testData = [{ id: 1 }, { id: 2 }];

    const dataArrayResponse = new DataArrayResponseDto(testData);

    expect(dataArrayResponse).toEqual({
      data: testData,
    });
  });
});
