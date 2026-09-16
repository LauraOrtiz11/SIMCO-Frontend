// Elemento de la Tabla/DataGrid (PostgreSQL + Mongo Status)
export interface PileListItem {
  id_pile: string;
  id_greenhouse: string;
  code: string;
  name: string | null;
  process_start_date: string;
  created_at: string;
  assigned_device_code: string | null;
  status: string;
}

// Detalle Completo Unificado (PostgreSQL + MongoDB Atlas)
export interface PileDetail extends PileListItem {
  location?: string;
  estimated_end_date?: string;
  base_material?: string;
  notes?: string;
  latest_readings?: Record<string, number | undefined>;
}

// Payload para Crear Pila
export interface CreatePilePayload {
  id_greenhouse: string;
  code: string;
  name?: string;
  process_start_date: string;
  location?: string;
  estimated_end_date?: string;
  base_material?: string;
  notes?: string;
}

// Payload para Editar Pila
export interface UpdatePilePayload {
  name?: string;
  process_start_date?: string;
  location?: string;
  estimated_end_date?: string;
  status?: string;
  base_material?: string;
  notes?: string;
}

// Respuesta Paginada
export interface PaginatedPileResponse {
  items: PileListItem[];
  total: number;
}

// Serie Temporal de Telemetría (MongoDB)
export interface TelemetryReading {
  timestamp: string;
  readings: {
    internal_temperature?: number;
    ambient_temperature?: number;
    humidity?: number;
    ph?: number;
    [key: string]: number | undefined;
  };
}
