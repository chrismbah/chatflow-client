import { DefaultToastOptions } from 'react-hot-toast';

export const toastOptions: DefaultToastOptions = {
  // Default options for all toasts
  style: {
    background: '#f3f4f6', // Tailwind's bg-gray-100
    color: '#000',
    textTransform: 'capitalize',
    fontSize: '16px', // Increased font size for better readability
    borderRadius: '6px', // Less border radius than default
    padding: '16px', // More space inside the toast
  },
  // Options for success toasts
  success: {
    style: {
      // background: '#4f46e5', // Tailwind's bg-indigo-500
      // color: '#fff',
      background: '#fff', // Tailwind's bg-gray-100
      color: '#000',
    },
  },
  // Options for error toasts
  error: {
    style: {
      // background: '#dc2626', // Tailwind's bg-red-600
      // color: '#fff',
      background: '#fff', // Tailwind's bg-gray-100
      color: '#000',
    },
  },
};