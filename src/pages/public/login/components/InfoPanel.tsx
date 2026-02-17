import type { Period } from '@types';
import { usePeriodsQuery } from '@hooks/use-periods-query.ts';
import { formatPeriod } from '@utils/formatPeriod.ts';
import { formatDate } from '@utils/formatDate.ts';

interface InfoBoxItem {
  title: string;
  description: string;
}

interface GenericInfoPanelProps {
  title: string;
  subtitle: string;
  items: InfoBoxItem[]; // Array con los 4 items
  buttonText: string;
  onToggle: () => void;
}

interface PeriodBoxProps {
  period: Period | null;
}

// Sub-componentes internos
const InfoBox = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-[#002a55] p-3.5 rounded-lg shadow-sm md:p-4 flex flex-col items-center justify-center text-center">
    <h3 className="font-semibold text-sm text-white mb-1 md:text-base">{title}</h3>
    <p className="text-[0.7rem] text-gray-400 m-0 md:text-xs">{description}</p>
  </div>
);

const PeriodBox = ({ period }: PeriodBoxProps) => {
  const displayPeriod = period ? formatPeriod(period.periodId) : 'Sin periodo activo';
  const closeDate = period?.endDate ? formatDate(period.endDate) : '—';

  return (
    <div className="bg-[#004a99] p-3.5 rounded-lg shadow-sm mb-5 md:p-4 md:mb-6 w-full">
      <h3 className="font-semibold text-sm text-white mb-1 md:text-base">
        Periodo Activo
      </h3>
      <p className="text-lg font-bold text-white m-0 md:text-xl">
        {displayPeriod}
      </p>
      <p className="text-[0.7rem] text-white mt-1 mb-0 md:text-xs">
        Cierre de registro: {closeDate}
      </p>
    </div>
  );
};


export const InfoPanel = (
  {
    title,
    subtitle,
    items,
    buttonText,
    onToggle,
  }: GenericInfoPanelProps) => {

  const { data: periods = [] } = usePeriodsQuery();
  const activePeriod = periods.find((p) => p.active);

  return (
    <div className="w-full flex flex-col items-center text-center px-10">
      <h1 className="text-2xl font-bold text-white mb-2 md:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-gray-400 mb-5 md:text-base md:mb-6">
        {subtitle}
      </p>

      {/* Renderizado dinámico de las cajas */}
      <div className="grid grid-cols-2 gap-2.5 mb-5 w-full md:gap-3 md:mb-6">
        {items.map((item, index) => (
          <InfoBox
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>

      <PeriodBox period={activePeriod} />

      <button
        onClick={onToggle}
        className="rounded-[20px] border border-white bg-transparent text-white text-[11px] font-bold py-2 px-7 uppercase tracking-wider transition-transform duration-75 cursor-pointer hover:bg-white/10 active:scale-95 focus:outline-none md:text-xs md:py-2.5 md:px-9"
      >
        {buttonText}
      </button>
    </div>
  );
};