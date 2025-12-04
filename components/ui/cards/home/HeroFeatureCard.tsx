interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  imageUrl,
}) => (
  <div className="flex flex-col text-start items-start w-full lg:w-auto">
    <div
      className="relative flex h-44 w-full items-center justify-center rounded-2xl bg-cover bg-center shadow-lg opacity-88
                 sm:h-56 lg:h-74"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black opacity-30 rounded-2xl" />
      <div className="relative z-10">{icon}</div>
    </div>
    <div className="mt-6 ">
      <h3 className="text-lg sm:text-xl lg:text-xl font-bold tracking-tighter text-[#2B281F]">
        {title}
      </h3>
      <p className="mt-2 max-w-[90%] sm:max-w-[40ch] lg:max-w-[12vw] text-sm sm:text-base tracking-tighter text-[#999999]">
        {description}
      </p>
    </div>
  </div>
);