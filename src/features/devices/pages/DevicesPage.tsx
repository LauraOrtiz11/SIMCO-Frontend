import { useState } from 'react';
import { useDevices } from '../hooks/useDevices';
import { DeviceTable } from '../components/DeviceTable';
import { DeviceFormModal } from '../components/DeviceFormModal';
import { PileHeaderFilters } from '@/features/piles/components/PileHeaderFilters';
import type { DeviceListItem, DeviceDetail } from '../types/device.types';
import { getDeviceById } from '../api/device.api';

export const DevicesPage = () => {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<string>('');

  const {
    devices,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createDevice,
    updateDevice,
    toggleDeviceStatus,
  } = useDevices(selectedGreenhouseId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceDetail | null>(
    null,
  );

  const totalPages = Math.ceil(total / limit);

  const handleOpenCreate = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (device: DeviceListItem) => {
    try {
      const detail = await getDeviceById(device.id_device);
      setSelectedDevice(detail);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error cargando detalle del dispositivo:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (selectedDevice) {
      await updateDevice(selectedDevice.id_device, {
        description: formData.description,
        sensors: formData.sensors,
      });
    } else {
      await createDevice(formData);
    }
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const handleToggleStatus = async (device: DeviceListItem) => {
    try {
      await toggleDeviceStatus(device.id_device);
    } catch (error) {
      console.error('Error al cambiar el estado del dispositivo:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado Centrado */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          DISPOSITIVOS E INFRAESTRUCTURA IoT
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Aprovisionamiento y monitoreo de dipostivos ESP32 y sensores
        </p>
      </div>

      {/* Selectores y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <PileHeaderFilters
            selectedGreenhouseId={selectedGreenhouseId}
            onSelectGreenhouse={(ghId) => {
              setSelectedGreenhouseId(ghId);
              setPage(1);
            }}
          />
        </div>

        {selectedGreenhouseId && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-lime-600 rounded-2xl shadow-xs hover:bg-lime-700 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            + Crear dispositivo
          </button>
        )}
      </div>

      {/* Tabla o Estado Vacío */}
      {!selectedGreenhouseId ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-700">
            Selecciona un invernadero
          </h3>
          <p className="max-w-md mt-1 text-sm text-gray-400">
            Elige un cliente e invernadero para administrar sus dispositivos.
          </p>
        </div>
      ) : (
        <>
          <DeviceTable
            devices={devices}
            loading={loading}
            onEdit={handleOpenEdit}
            onToggleStatus={handleToggleStatus}
          />

          {/* BARRA DE PAGINACIÓN */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl bg-white border border-gray-100 shadow-xs">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                Siguiente
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  Página <span className="font-semibold">{page}</span> de{' '}
                  <span className="font-semibold">{totalPages || 1}</span>
                </p>
              </div>

              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-xl shadow-xs"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Anterior
                  </button>

                  <span className="relative inline-flex items-center px-4 py-2 text-xs font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                    {page}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages || totalPages === 0}
                    className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Formulario */}
      <DeviceFormModal
        isOpen={isModalOpen}
        selectedGreenhouseId={selectedGreenhouseId}
        device={selectedDevice}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DevicesPage;
