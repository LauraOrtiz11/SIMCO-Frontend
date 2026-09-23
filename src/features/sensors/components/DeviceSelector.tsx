export interface DeviceBasic {
  id_device: string;
  code: string;
  description?: string;
}

interface DeviceSelectorProps {
  devices: DeviceBasic[];
  value: string;
  onChange: (deviceId: string) => void;
  loading?: boolean;
}

export const DeviceSelector = ({
  devices,
  value,
  onChange,
  loading = false,
}: DeviceSelectorProps) => {
  return (
    <div className="w-full sm:w-80">
      <label
        htmlFor="device-selector"
        className="block mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase"
      >
        Dispositivo / Nodo IoT
      </label>

      <div className="relative">
        <select
          id="device-selector"
          value={value}
          disabled={loading}
          onChange={(e) => onChange(e.target.value)}
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
            shadow-xs
            outline-none
            transition-all
            duration-200
            cursor-pointer
            hover:border-gray-300
            focus:border-amber-600
            focus:ring-2
            focus:ring-amber-100
            disabled:bg-gray-50
            disabled:cursor-not-allowed
          "
        >
          <option value="">
            {loading
              ? 'Cargando dispositivos...'
              : 'Selecciona un dispositivo IoT...'}
          </option>

          {devices.map((dev) => (
            <option key={dev.id_device} value={dev.id_device} className="py-1">
              {dev.code} {dev.description ? `- ${dev.description}` : ''}
            </option>
          ))}
        </select>

        {/* Flecha personalizada */}
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
