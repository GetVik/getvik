
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const api = {
  get: async (..._args: any[]) => ({ data: {} }),
  post: async (..._args: any[]) => ({ data: {} }),
  put: async (..._args: any[]) => ({ data: {} }),
  delete: async (..._args: any[]) => ({ data: {} }),
  patch: async (..._args: any[]) => ({ data: {} }),
  interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
  }
};

export default api;