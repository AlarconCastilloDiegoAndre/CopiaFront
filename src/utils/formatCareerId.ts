// Funcion para formatear el id de carrera (SOF-18)
const formatCareerId = (careerId = '') => {
  const upper = careerId.toUpperCase();
  return upper.length > 3 ? `${upper.slice(0, 3)} - ${upper.slice(3)}` : upper.slice(0, 3);
};

export default formatCareerId;