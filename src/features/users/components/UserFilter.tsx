interface Props {
  clients: any[];
  value: string;
  onChange: (value: string) => void;
}

export const UserFilter = ({ clients, value, onChange }: Props) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Todos</option>

      {clients.map((c) => (
        <option key={c.id_client} value={c.id_client}>
          {c.name}
        </option>
      ))}
    </select>
  );
};
