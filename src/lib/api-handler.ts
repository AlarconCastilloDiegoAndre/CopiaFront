import { parseErrorMessage } from '../utils/parseErrorMessage.ts';

// Funcion para hacer peticiones seguras a la api
export const handleApiRequest = async <T>(
  apiRequest: Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await apiRequest;
    return response.data;
  } catch (error) {
    const message = parseErrorMessage(error);
    throw new Error(message);
  }
};