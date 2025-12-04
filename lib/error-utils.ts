

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as any).response;
    if (resp && resp.data) {
      const data = resp.data;

      if (data.errors) {
        if (Array.isArray(data.errors)) {

          return data.errors.map((err: string | { message?: string }) => {
            if (typeof err === 'string') return err;
            if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
              return err.message;
            }
            return JSON.stringify(err);
          }).join('\n');
        } else if (typeof data.errors === 'object') {

          return Object.entries(data.errors)
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');
        }
      }


      if (data.issues && Array.isArray(data.issues)) {
        return data.issues.map((issue: { message: string }) => issue.message).join('\n');
      }


      if (data.message) {
        return data.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};
