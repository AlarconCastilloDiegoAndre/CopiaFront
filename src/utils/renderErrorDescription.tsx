import { parseErrorMessage } from '@utils/parseErrorMessage.ts';

export const renderErrorDescription = (err: unknown) => {
  const message = parseErrorMessage(err);

  // Lista de errores (con saltos de línea)
  if (message.includes('\n')) {
    return (
      <ul className="list-disc ml-0 pl-0 mt-2 space-y-1 opacity-90 font-normal text-red-800 text-sm">
        {message.split('\n').map((line, index) => (
          <li key={index}> {line} </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="opacity-90 font-normal text-red-800 text-sm">
      {message}
    </div>
  );
};