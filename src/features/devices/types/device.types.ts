// Catálogo de Tipos de Sensores (sensor_type)
export interface SensorType {
  id_sensor_type: number;
  name: string;
  unit: string;
}

// Estructura del Sensor relacional (sensor)
export interface Sensor {
  id_sensor?: string;
  id_device?: string;
  id_sensor_type: number;
  code: string;
  location?: string;
  sensor_type?: SensorType;
}

// Elemento para la Lista / Tabla DataGrid
export interface DeviceListItem {
  id_device: string;
  id_greenhouse: string;
  id_pile?: string;
  code: string;
  description?: string;
  assigned_pile_code?: string;
  sensors_count: number;
  is_active: boolean; // 👈 Estado relacional reflejado en la tabla
  registered_at: string;
}

// Detalle Completo del Dispositivo
export interface DeviceDetail extends DeviceListItem {
  sensors: Sensor[];
}

// Payload para Crear Dispositivo con Sensores Anidados
export interface CreateDevicePayload {
  id_greenhouse: string;
  code: string;
  description?: string;
  sensors?: {
    id_sensor_type: number;
    code: string;
    location?: string;
  }[];
}

// Payload para Actualizar Dispositivo
export interface UpdateDevicePayload {
  description?: string;
  sensors?: {
    id_sensor_type: number;
    code: string;
    location?: string;
  }[];
}

// Respuesta Paginada de la API
export interface PaginatedDeviceResponse {
  items: DeviceListItem[];
  total: number;
}
