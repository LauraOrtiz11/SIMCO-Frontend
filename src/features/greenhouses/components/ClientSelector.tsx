import type { ClientBasic } from '../types/greenhouse.types';

interface ClientSelectorProps {
  clients: ClientBasic[];
  value: string;
  onChange: (clientId: string) => void;
}

export const ClientSelector = ({
  clients,
  value,
  onChange,
}: ClientSelectorProps) => {
  return (
    <div className="w-full sm:w-80">
      <label
        htmlFor="client-selector"
        className="block mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase"
      >
        Cliente
      </label>

      <div className="relative">
        <select
          id="client-selector"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            w-full
            appearance-none
            pl-4
            pr-10
            py-2.5
            text-sm
            font-medium
            text-gray-800
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-sm
            outline-none
            transition-all
            duration-200
            cursor-pointer
            hover:border-gray-300
            focus:border-green-600
            focus:ring-2
            focus:ring-green-100
          "
        >
          <option value="" disabled className="text-gray-400">
            Selecciona un cliente...
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
              className="text-gray-800 py-1"
            >
              {client.name}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
