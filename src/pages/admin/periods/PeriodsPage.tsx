import InactivePeriodCard from '@components/Cards/PeriodCard/InactivePeriodCard.tsx';
import ActivePeriodCard from '@components/Cards/PeriodCard/ActivePeriodCard.tsx';
import { CollapsibleSection } from '@components/CollapsibleSection';
import { usePeriodsActions } from './hooks/use-periods-actions.tsx';
import PageHeader from '@components/PageHeader';
import Card from '@components/Cards/Card';
import Button from '@components/Button';
import { IoAdd } from 'react-icons/io5';
import { Calendar } from 'lucide-react';
import Label from '@components/Label';
import ErrorCard from '@components/ErrorCard';
import CardSkeleton from '@components/Cards/CardSkeleton';

const PeriodsPage = () => {
  const {
    isLoading,
    error,
    activePeriod,
    upcomingPeriods,
    pastPeriods,
    handleEditClick,
    handleDeleteClick,
    handleCreateClick,
    handleAdvanceSemesterClick
  } = usePeriodsActions();


  if (isLoading) {
    return (
      <main className="max-w-[80rem] mx-auto p-6">
        <Card className="mb-8">
          <PageHeader
            title="Gestión de periodos"
            icon={<Calendar />}
            className="pb-5"
          />
          <div className="mt-4">
            <Label className="mb-2 block">Periodo actual</Label>
            <CardSkeleton variant="period" count={1} />
          </div>
        </Card>

        <Card className="mb-5">
          <h3 className="text-lg font-bold text-[#003d6b] mb-4">Próximos Periodos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton variant="period" count={2} />
          </div>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <ErrorCard error={error} />
    );
  }

  return (
    <main className="max-w-[80rem] mx-auto p-6 text-[#0f1724]">
      {/* SECCIÓN SUPERIOR: Periodo Actual + Header */}
      <Card className="mb-8 overflow-visible">
        <PageHeader
          title="Gestión de periodos"
          icon={<Calendar />}
          className="pb-5"
          actions={
            <Button className="px-4 py-2 mb-1" onClick={handleCreateClick}>
              <IoAdd size={20} className="mr-2" />
              Crear periodo
            </Button>
          }
        />

        <div className="mt-4">
          <Label className="mb-2 block">Periodo actual</Label>

          {activePeriod ? (
            <div className="rounded-lg">
              <ActivePeriodCard
                period={activePeriod}
                onEdit={() =>
                  handleEditClick(activePeriod.periodId, activePeriod.startDate, activePeriod.endDate)
                }
                onAdvanceSemester={() => handleAdvanceSemesterClick()}
              />
            </div>
          ) : (
            <div className="p-4 bg-gray-50 text-gray-500 rounded-lg border border-dashed border-gray-300 text-center">
              No hay un periodo activo en este momento.
            </div>
          )}
        </div>
      </Card>

      {/* SECCIÓN MEDIA: Próximos Periodos */}
      {upcomingPeriods.length > 0 && (
        <Card className="mb-5 pb-0.5">
          <div className="flex flex-col gap-4 mb-8">
            <h3 className="text-lg font-bold text-[#003d6b]">Próximos Periodos</h3>
            <div className="flex flex-col gap-3">
              {upcomingPeriods.map((period) => (
                <InactivePeriodCard
                  key={period.periodId}
                  period={period}
                  onEdit={() =>
                    handleEditClick(period.periodId, period.startDate, period.endDate)
                  }
                  onDelete={() => handleDeleteClick(period.periodId)}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* SECCIÓN INFERIOR: Historial (Colapsable) */}
      <div className="flex flex-col gap-4">
        <CollapsibleSection
          title="Historial de Periodos"
          badgeCount={pastPeriods.length}
          defaultOpen={false}
        >
          {pastPeriods.length > 0 ? (
            <div className="flex flex-col gap-3 pt-2">
              {pastPeriods.map((period) => (
                <InactivePeriodCard
                  key={period.periodId}
                  period={period}
                  onEdit={() =>
                    handleEditClick(period.periodId, period.startDate, period.endDate)
                  }
                  onDelete={() => handleDeleteClick(period.periodId)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic px-2 py-4">
              No hay periodos anteriores registrados.
            </p>
          )}
        </CollapsibleSection>
      </div>
    </main>
  );
};

export default PeriodsPage;