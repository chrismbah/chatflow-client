export type IError = Error & {
  response: {
    data: {
      data: {
        message: string;
      };
      message: string;
      error: string;
    };
  };
  request: {
    status: number;
    statusText: string;
  };
  code: string;
};

export const errorHandler = (
  err: Error & {
    response: {
      data: {
        data: {
          message: string;
        };
        message: string;
        error: string;
      };
    };
    request: {
      status: number;
      statusText: string;
    };
    code: string;
  }
) => {
  return err?.response?.data?.data?.message || err.message;
};

export const responseHandler = (res: { message: string }) => {
  return res.message;
};
