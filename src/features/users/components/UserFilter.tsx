interface Props {
  clients: any[];
  value: string;
  onChange: (value: string) => void;
}

export const UserFilter = ({ clients, value, onChange }: Props) => {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full sm:w-64
          px-4 py-2.5
          text-sm font-medium
          text-gray-800 bg-white
          border border-gray-200 rounded-xl
          shadow-sm outline-none cursor-pointer
          focus:ring-2 focus:ring-gray-400/20
        "
      >
        <option value="">Todos los clientes</option>

        {clients.map((c) => {
          const id = c.id_client || c.id;
          return (
            <option key={id} value={id}>
              {c.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
