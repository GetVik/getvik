'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, ArrowRight, CheckCircle, AlertCircle, Mail, MessageSquare, User, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitContactForm, IContactFormData, InquiryType } from '@/services/contact.service'; 

interface BaseFieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; className: string; }>;
  error?: string;
}

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>, BaseFieldProps {}
interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'>, BaseFieldProps {}
interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>, BaseFieldProps {}

const FormInput: React.FC<FormInputProps> = ({ id, label, icon: Icon, error, className, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-[#2b281f]">
        <Icon size={16} className="text-[#999999]" />
        {label}
      </label>
      <input
        id={id}
        className={`block w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#2b281f] shadow-inner transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 ${
          error 
            ? 'border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 ring-gray-200/50 focus:border-pink-500 focus:ring-pink-500'
        }`}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1"
        >
          <AlertCircle size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
};

const FormSelect: React.FC<FormSelectProps> = ({ id, label, icon: Icon, error, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-[#2b281f]">
        <Icon size={16} className="text-[#999999]" />
        {label}
      </label>
      <select
        id={id}
        className={`block w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#2b281f] shadow-inner transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 ${
          error 
            ? 'border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 ring-gray-200/50 focus:border-pink-500 focus:ring-pink-500'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1"
        >
          <AlertCircle size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
};

const FormTextarea: React.FC<FormTextareaProps> = ({ id, label, icon: Icon, error, ...props }) => {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-[#2b281f]">
        <Icon size={16} className="text-[#999999]" />
        {label}
      </label>
      <textarea
        id={id}
        rows={5}
        className={`block w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#2b281f] shadow-inner transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 ${
          error 
            ? 'border-red-300 ring-red-100 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 ring-gray-200/50 focus:border-pink-500 focus:ring-pink-500'
        }`}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1"
        >
          <AlertCircle size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
};

const SuccessMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-12"
  >
    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
      <CheckCircle size={32} className="text-green-700" />
    </div>
    <h3 className="text-2xl font-bold tracking-tighter text-[#2b281f]">
      Message Sent!
    </h3>
    <p className="mt-2 text-base font-medium tracking-tighter text-[#585857] max-w-md">
      Thanks for reaching out. We&apos;ll get back to you as soon as possible.
    </p>
  </motion.div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState<IContactFormData>({
    name: '',
    email: '',
    inquiryType: InquiryType.GENERAL,
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IContactFormData, string>>>({});

  const { mutate, isPending, isSuccess, isError, error } = useMutation<
    unknown,
    Error,
    IContactFormData
  >({
    mutationFn: submitContactForm,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    if (errors[id as keyof IContactFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof IContactFormData, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message is too short (min 10 characters)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    if (validateForm()) {
      mutate(formData);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-gray-50 bg-dot-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 ">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter text-[#2b281f] sm:text-[2.5rem]">
            Get in Touch
          </h2>
          <p className="mt-4 text-base font-medium tracking-tighter text-[#585857] sm:text-lg">
            Have a question, a bug to report, or a sales inquiry? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 sm:p-10 bg-white rounded-3xl shadow-xl ring-1 ring-gray-100">
          {isSuccess ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput
                id="name"
                label="Full Name"
                type="text"
                placeholder="Your Name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <FormInput
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormSelect
                id="inquiryType"
                label="Inquiry Type"
                icon={HelpCircle}
                value={formData.inquiryType}
                onChange={handleChange}
                error={errors.inquiryType}
              >
                <option value={InquiryType.GENERAL}>General Question</option>
                <option value={InquiryType.SALES}>Sales Inquiry</option>
                <option value={InquiryType.PAYMENT}>Payment Issue</option>
                <option value={InquiryType.BUG}>Bug Report</option>
              </FormSelect>
              <FormInput
                id="subject"
                label="Subject"
                type="text"
                placeholder="e.g., 'Question about pricing' (Optional)"
                icon={MessageSquare}
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
              />
              <FormTextarea
                id="message"
                label="Your Message"
                icon={MessageSquare}
                placeholder="Please describe your issue or question in detail..."
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
              />
              
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full cursor-pointer bg-black px-4 py-3 text-base font-bold tracking-tighter text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                
                {isError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center gap-2 text-sm font-semibold text-red-600"
                  >
                    <AlertCircle size={16} />
                    <p>{error?.message || 'Failed to send message. Please try again.'}</p>
                  </motion.div>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base font-bold tracking-tighter text-[#585857]">
            You can also reach us directly at
            <a href="mailto:support.getvik@gmail.com" className="ml-2 text-gray-600 font-semibold hover:underline">
              support.getvik@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}