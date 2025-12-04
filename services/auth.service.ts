import api from "@/lib/api";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const signupUser = async (data: SignupData) => {
  const response = await api.post('/users/signup', data);
  return response.data;
};

export const verifySignupOtp = async (email: string, otp: string) => {
  const response = await api.post('/users/verify-signup-otp', { email, otp });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: { email: string; otp: string; password: string }) => {
  const response = await api.post('/users/reset-password', data);
  return response.data;
};

export const resendSignupOtp = async (email: string) => {
  const response = await api.post('/users/resend-otp', { email });
  return response.data;
};
