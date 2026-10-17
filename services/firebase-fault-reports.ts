import type { FaultReport, NewFaultReport } from '@/context/medical-support';

const FAULT_REPORTS_URL =
  'https://reactnative-e8f0a-default-rtdb.asia-southeast1.firebasedatabase.app/faultReports.json';

type FirebaseFaultReportRecord = {
  device: string;
  faultTitle: string;
  description: string;
  image: {
    data: string;
    mimeType: string;
    fileName: string;
  };
  status: 'Pending';
  reportedByRole: 'doctor';
  createdAt: string;
};

function getAuthenticatedUrl(idToken: string) {
  if (!idToken) {
    throw new Error('Your session is unavailable. Please log out and sign in again.');
  }

  return `${FAULT_REPORTS_URL}?auth=${encodeURIComponent(idToken)}`;
}

async function getFirebaseError(response: Response) {
  const body = await response.text();
  if (!body) return `Firebase request failed (${response.status}).`;

  try {
    const parsed = JSON.parse(body) as { error?: string };
    if (response.status === 401 && parsed.error?.toLowerCase() === 'permission denied') {
      return 'Your account does not have permission to submit fault reports. Please sign in again or contact the administrator.';
    }

    return parsed.error ?? body;
  } catch {
    return body;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function createFaultReport(
  report: NewFaultReport,
  idToken: string,
): Promise<FaultReport> {
  const record: FirebaseFaultReportRecord = {
    device: report.device.trim(),
    faultTitle: report.faultTitle.trim(),
    description: report.description.trim(),
    image: {
      data: report.imageBase64,
      mimeType: report.imageMimeType,
      fileName: report.imageFileName || 'fault.jpg',
    },
    status: 'Pending',
    reportedByRole: 'doctor',
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(getAuthenticatedUrl(idToken), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error(await getFirebaseError(response));
  }

  const payload: unknown = await response.json();
  if (!isObject(payload) || typeof payload.name !== 'string') {
    throw new Error('Firebase did not return an ID for the fault report.');
  }

  return {
    id: payload.name,
    device: record.device,
    faultTitle: record.faultTitle,
    description: record.description,
    status: record.status,
    createdAt: record.createdAt,
  };
}
