import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getCourseTypeLabel = (type) => {
  const labels = {
    diploma: 'Diploma Program',
    bachelor: 'Bachelor Program',
    certification: 'Certification'
  };
  return labels[type] || type;
};

export const getCourseTypeColor = (type) => {
  const colors = {
    diploma: 'bg-[#CCFF00] text-black',
    bachelor: 'bg-[#00FF66] text-black',
    certification: 'bg-[#7C3AED] text-white'
  };
  return colors[type] || 'bg-gray-600 text-white';
};
