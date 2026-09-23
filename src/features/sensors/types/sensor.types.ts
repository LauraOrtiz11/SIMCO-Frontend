// Elemento devuelto en la lista del DataGrid / Tabla de Sensores
export interface SensorListItem {
  id_sensor: string;
  id_device: string;
  device_code: string;
  id_sensor_type: number;
  sensor_type_name: string;
  code: string;
  location?: string | null;
  is_active: boolean;
}

// Payload para Crear un Nuevo Sensor
export interface CreateSensorPayload {
  id_device: string;
  id_sensor_type: number;
  code: string;
  location?: string;
}

// Payload para Actualizar / Modificar Sensor Existente
export interface UpdateSensorPayload {
  location?: string;
  is_active?: boolean;
}

// Respuesta Paginada del Endpoint
export interface PaginatedSensorResponse {
  items: SensorListItem[];
  total: number;
}
