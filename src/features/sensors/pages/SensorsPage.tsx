import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSensors } from '../hooks/useSensors';
import { SensorTable } from '../components/SensorTable';
import { SensorFormModal } from '../components/SensorFormModal';
import { DeviceSelector, type DeviceBasic } from '../components/DeviceSelector';
import type { SensorListItem } from '../types/sensor.types';
import { api } from '@/lib/axios';

export const SensorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDeviceId = searchParams.get('deviceId') || '';

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(urlDeviceId);
  const [devices, setDevices] = useState<DeviceBasic[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);

  // Sincronizar el ID si la URL cambia dinámicamente
  useEffect(() => {
    if (urlDeviceId) {
      setSelectedDeviceId(urlDeviceId);
    }
  }, [urlDeviceId]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoadingDevices(true);
        const { data } = await api.get('/devices/');
        const items = Array.isArray(data) ? data : data.items || [];
        setDevices(items);
      } catch (err) {
        console.error('Error cargando dispositivos:', err);
      } finally {
        setLoadingDevices(false);
      }
    };
    fetchDevices();
  }, []);

  const {
    sensors,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createSensor,
    updateSensor,
    toggleSensorStatus,
  } = useSensors(selectedDeviceId);

  const [selectedSensorForEdit, setSelectedSensorForEdit] =
    useState<SensorListItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);
  const currentDevice = devices.find((d) => d.id_device === selectedDeviceId);

  const handleDeviceChange = (devId: string) => {
    setSelectedDeviceId(devId);
    setPage(1);
    if (devId) {
      setSearchParams({ deviceId: devId });
    } else {
      setSearchParams({});
    }
  };

  const handleOpenCreate = () => {
    setSelectedSensorForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (sensor: SensorListItem) => {
    setSelectedSensorForEdit(sensor);
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedSensorForEdit) {
      await updateSensor(selectedSensorForEdit.id_sensor, formData);
    } else {
      await createSensor(formData);
    }
    setIsFormModalOpen(false);
    setSelectedSensorForEdit(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 font-[Poppins]">
            Gestión de Sensores IoT
          </h1>
          <p className="text-xs text-gray-500">
            Administración de sensores asignados a las tarjetas electrónicas
            {currentDevice ? ` (Nodo: ${currentDevice.code})` : ''}
          </p>
        </div>
        {selectedDeviceId && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs rounded-xl cursor-pointer transition shrink-0"
          >
            + Nuevo Sensor
          </button>
        )}
      </div>

      {/* SELECTOR DESPLEGABLE SUPERIOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <DeviceSelector
          devices={devices}
          value={selectedDeviceId}
          loading={loadingDevices}
          onChange={handleDeviceChange}
        />
      </div>

      {/* TABLA Y PAGINACIÓN */}
      {!selectedDeviceId ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-700">
            Selecciona un dispositivo IoT
          </h3>
          <p className="max-w-md mt-1 text-sm text-gray-400">
            Elige un nodo en el selector o navega desde la tabla de dispositivos
            para gestionar sus sensores.
          </p>
        </div>
      ) : (
        <>
          <SensorTable
            sensors={sensors}
            loading={loading}
            onEdit={handleOpenEdit}
            onToggleStatus={(sensor) => toggleSensorStatus(sensor.id_sensor)}
          />

          {/* BARRA DE PAGINACIÓN DE 5 ELEMENTOS */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl bg-white border border-gray-100 shadow-xs">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Siguiente
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Página <span className="font-semibold">{page}</span> de{' '}
                <span className="font-semibold">{totalPages || 1}</span> (
                {total} sensores en total - 5 por página)
              </p>

              <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 rounded-l-xl hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-xs font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 rounded-r-xl hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Modal de Formulario */}
      {selectedDeviceId && (
        <SensorFormModal
          isOpen={isFormModalOpen}
          selectedDeviceId={selectedDeviceId}
          sensor={selectedSensorForEdit}
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedSensorForEdit(null);
          }}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default SensorsPage;
