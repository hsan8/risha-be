import { CustomRpcException, IRpcError } from './custom-rpc.exception';

describe('CustomRpcException', () => {
  describe('getError', () => {
    it('should return the RPC error if available', () => {
      const exception = {
        rpcError: {
          message: 'RPC Error Message',
          status: 500,
        },
      };

      const customException = new CustomRpcException(exception);
      const result = customException.getError();

      expect(result).toEqual(exception.rpcError);
    });

    it('should create a new RPC error if none provided', () => {
      const exception = {
        message: 'Error Message',
        status: 404,
      };

      const customException = new CustomRpcException(exception);
      const result = customException.getError();

      const expected: IRpcError = {
        message: exception.message,
        status: exception.status,
      };

      expect(result).toEqual(expected);
    });
  });
});
