import api from "@/lib/api";

export enum InquiryType {
  GENERAL = "general",
  SALES = "sales",
  BUG = "bug",
  PAYMENT = "payment"
}

export interface IContactFormData {
  name: string;
  email: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

export const submitContactForm = async (data: IContactFormData) => {
  return api.post('/contact', data);
};
