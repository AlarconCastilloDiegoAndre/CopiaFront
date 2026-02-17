import PageHeader from '@components/PageHeader/PageHeader.tsx';
import { LayoutDashboard } from 'lucide-react';
import { useAdminDashboard } from './hooks/use-admin-dashboard.ts';
import ActivePeriodBadge from './components/ActivePeriodBadge';
import NoPeriodAlert from './components/NoPeriodAlert';
import EnrollmentsTable from './components/EnrollmentsTable';
import Card from '@components/Cards/Card';
import CardSkeleton from '@components/Cards/CardSkeleton';
import TableSkeleton from '@components/Tables/TableSkeleton';
import DashboardStats from './components/DashboardStats/DashboardStats.tsx';

const AdminDashboard = () => {
  const {
    stats,
    report,
    careers,
    groups,
    periods,
    activePeriod,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCareer,
    setSelectedCareer,
    selectedGroup,
    setSelectedGroup,
    selectedPeriod,
    setSelectedPeriod,
    selectedSubjectType,
    setSelectedSubjectType,
    meta,
    page,
    setPage,
    sortConfig,
    handleSort,
  } = useAdminDashboard();

  if (isLoading && !report.length) {
    return (
      <main className="max-w-[90rem] mx-auto p-6 space-y-8">
        <Card>
          <PageHeader
            title="Dashboard Administrativo"
            subtitle="Resumen general del ciclo escolar y estadísticas."
            icon={<LayoutDashboard />}
          />

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} variant="stat" count={1} />
            ))}
          </div>
        </Card>

        {/* Table Skeleton */}
        <TableSkeleton columns={4} rows={7} showFilters={true} />
      </main>
    );
  }

  return (
    <main className="max-w-[90rem] mx-auto p-6 space-y-8 text-[#0f1724]">
      {/* Header */}
      <Card>
        <PageHeader
          title="Dashboard Administrativo"
          subtitle="Resumen general del ciclo escolar y estadísticas."
          icon={<LayoutDashboard />}
          actions={
            <div className="text-right hidden sm:block">
              <ActivePeriodBadge activePeriod={activePeriod} />
            </div>
          }
        />

        {/* Alerta de periodo inactivo */}
        {!activePeriod && <NoPeriodAlert />}

        {/* Estadísticas */}
        <DashboardStats stats={stats} />
      </Card>

      {/* Tabla de inscripciones */}
      <EnrollmentsTable
        report={report}
        careers={careers}
        groups={groups}
        periods={periods}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCareer={selectedCareer}
        setSelectedCareer={setSelectedCareer}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedSubjectType={selectedSubjectType}
        setSelectedSubjectType={setSelectedSubjectType}
        meta={meta}
        page={page}
        setPage={setPage}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </main>
  );
};

export default AdminDashboard;