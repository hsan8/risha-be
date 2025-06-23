export interface IRpcError {
  message: string;
  status?: number;
}

export class CustomRpcException {
  private readonly rpcError: IRpcError;

  constructor(exception: any) {
    this.rpcError =
      (exception.rpcError as IRpcError) || // propagate RPC error if any
      ({
        message: exception.error?.response?.message || exception.message,
        errors: exception.error?.response?.errors || exception.errors,
        status: exception.error?.status || exception.status,
      } as IRpcError);
  }

  // for testing
  public getError(): IRpcError {
    return this.rpcError;
  }
}
