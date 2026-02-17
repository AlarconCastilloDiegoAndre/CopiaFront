import StatCard from '@components/Cards/StatCard/StatCard.tsx';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
import type { DashboardStats as DashboardStatsType } from '@services/admin.service.ts';

interface DashboardStatsProps {
  stats?: DashboardStatsType; 
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
      <StatCard
        label="Total Alumnos"
        value={stats?.totalStudents?.toLocaleString() || '0'}
        icon={GraduationCap}
        color="blue"
        path="/admin/students"
      />
      <StatCard
        label="Materias Activas"
        value={stats?.totalSubjects || '0'}
        icon={BookOpen}
        color="green"
        path="/admin/subjects"
      />
      <StatCard
        label="Total de periodos"
        value={stats?.periodsCount || '0'}
        icon={Calendar}
        color="purple"
        path="/admin/periods"
      />
    </div>
  );
};

export default DashboardStats;