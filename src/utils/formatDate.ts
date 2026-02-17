export const formatDate = (dateString: string): string => {
  // Interpretar la fecha en zona horaria de México
  const date = new Date(dateString + 'T12:00:00');

  const day = date.toLocaleDateString('es-MX', {
    day: '2-digit',
    timeZone: 'America/Mexico_City'
  });

  const month = date.toLocaleDateString('es-MX', {
    month: 'short',
    timeZone: 'America/Mexico_City'
  })
    .replace('.', '')
    .toUpperCase();

  const year = date.toLocaleDateString('es-MX', {
    year: 'numeric',
    timeZone: 'America/Mexico_City'
  });

  return `${day} - ${month} - ${year}`;
};