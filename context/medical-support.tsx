import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from '@/store/auth-context';
import {
  createMarketplaceDevice,
  deleteMarketplaceDevice,
  getMarketplaceDevices,
} from '@/services/firebase-marketplace';
import { createFaultReport } from '@/services/firebase-fault-reports';

export type FaultReport = {
  id: string;
  device: string;
  status: 'Accepted' | 'Pending';
  faultTitle?: string;
  description?: string;
  createdAt?: string;
};

export type NewFaultReport = {
  device: string;
  faultTitle: string;
  description: string;
  imageBase64: string;
  imageMimeType: string;
  imageFileName?: string;
};

export type MedicalDevice = {
  id: string;
  name: string;
  model: string;
  price: string;
  status: 'active';
  listedByRole: 'doctor';
  createdAt: string;
};

export type NewDevice = Pick<MedicalDevice, 'name' | 'model' | 'price'>;

type MedicalSupportContextValue = {
  reports: FaultReport[];
  devices: MedicalDevice[];
  devicesError: string | null;
  isLoadingDevices: boolean;
  addFaultReport: (report: NewFaultReport) => Promise<FaultReport>;
  addDevice: (device: NewDevice) => Promise<MedicalDevice>;
  deleteDevice: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
};

const initialReports: FaultReport[] = [
  { id: 'R001', device: 'Patient Monitor', status: 'Accepted' },
  { id: 'R002', device: 'ECG Machine', status: 'Pending' },
  { id: 'R003', device: 'Infusion Pump', status: 'Accepted' },
];

const MedicalSupportContext = createContext<MedicalSupportContextValue | null>(null);

export function MedicalSupportProvider({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState<FaultReport[]>(initialReports);
  const [devices, setDevices] = useState<MedicalDevice[]>([]);
  const [devicesError, setDevicesError] = useState<string | null>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  const refreshDevices = useCallback(async () => {
    setDevicesError(null);
    setIsLoadingDevices(true);
    try {
      setDevices(await getMarketplaceDevices(token));
    } catch (error) {
      setDevicesError(error instanceof Error ? error.message : 'Unable to load marketplace devices.');
    } finally {
      setIsLoadingDevices(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshDevices();
  }, [refreshDevices]);

  const addFaultReport = useCallback(async (report: NewFaultReport) => {
    const createdReport = await createFaultReport(report, token);
    setReports((current) => [createdReport, ...current]);
    return createdReport;
  }, [token]);

  const addDevice = useCallback(async (device: NewDevice) => {
    const createdDevice = await createMarketplaceDevice(device, token);
    setDevices((current) => [createdDevice, ...current.filter((item) => item.id !== createdDevice.id)]);
    return createdDevice;
  }, [token]);

  const deleteDevice = useCallback(async (deviceId: string) => {
    await deleteMarketplaceDevice(deviceId, token);
    setDevices((current) => current.filter((device) => device.id !== deviceId));
  }, [token]);

  const value = useMemo<MedicalSupportContextValue>(
    () => ({
      reports,
      devices,
      devicesError,
      isLoadingDevices,
      addFaultReport,
      addDevice,
      deleteDevice,
      refreshDevices,
    }),
    [addDevice, addFaultReport, deleteDevice, devices, devicesError, isLoadingDevices, refreshDevices, reports],
  );

  return <MedicalSupportContext.Provider value={value}>{children}</MedicalSupportContext.Provider>;
}

export function useMedicalSupport() {
  const value = useContext(MedicalSupportContext);
  if (!value) {
    throw new Error('useMedicalSupport must be used inside MedicalSupportProvider');
  }
  return value;
}
