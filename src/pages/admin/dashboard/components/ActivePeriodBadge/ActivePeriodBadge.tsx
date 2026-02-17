import type { Period } from '@types';


interface ActivePeriodBadgeProps {
  activePeriod?: Period;
}

const ActivePeriodBadge = ({ activePeriod }: ActivePeriodBadgeProps) => {
  if (!activePeriod) {
    return (
      <span className="px-3 py-1 text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded-full">
        Sin Ciclo Activo
      </span>
    );
  }

  return (
    <span className="px-3 py-1 text-sm font-semibold text-[#003d6b] bg-blue-50 border border-blue-100 rounded-full">
      Ciclo Activo: {activePeriod.periodId}
    </span>
  );
};

export default ActivePeriodBadge;
