export function formatPeriod(periodo: string): string {
  const [year, start, end] = periodo.split("-");

  const meses: Record<string, string> = {
    ENE: "Enero",
    FEB: "Febrero",
    MAR: "Marzo",
    ABR: "Abril",
    MAY: "Mayo",
    JUN: "Junio",
    JUL: "Julio",
    AGO: "Agosto",
    SEP: "Septiembre",
    OCT: "Octubre",
    NOV: "Noviembre",
    DIC: "Diciembre",
  };

  return `${meses[start]} - ${meses[end]} ${year}`;
}