import {motion} from 'framer-motion'
interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};


export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
}) => {
  const initials = getInitials(name);

  return (
    <motion.div className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 text-start shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <p className="text-[14px] leading-relaxed font-medium text-gray-700">
        “{quote}”
      </p>

      <div className="mt-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-800 to-gray-600 flex items-center justify-center shrink-0 text-sm font-bold text-white tracking-tight shadow-inner">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-[12px] text-gray-900">{name}</p>
          <p className="text-[12px] font-medium text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};