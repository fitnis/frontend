// Base API URL
const API_BASE_URL = "http://localhost:8080/api";

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Query keys for React Query
export const queryKeys = {
  patients: {
    all: ["patients"] as const,
    detail: (id: number) => ["patients", id] as const,
  },
  examinations: {
    all: ["examinations"] as const,
    detail: (id: number) => ["examinations", id] as const,
    byPatient: (patientId: number) =>
      ["examinations", "patient", patientId] as const,
  },
  samples: {
    all: ["samples"] as const,
    detail: (id: number) => ["samples", id] as const,
    byExamination: (examinationId: number) =>
      ["samples", "examination", examinationId] as const,
  },
  prescriptions: {
    all: ["prescriptions"] as const,
    detail: (id: number) => ["prescriptions", id] as const,
    byExamination: (examinationId: number) =>
      ["prescriptions", "examination", examinationId] as const,
  },
  referrals: {
    all: ["referrals"] as const,
    detail: (id: number) => ["referrals", id] as const,
    byExamination: (examinationId: number) =>
      ["referrals", "examination", examinationId] as const,
  },
};

// Patient API functions
export async function getPatients() {
  return fetchApi<Patient[]>("/patients");
}

export async function getPatient(id: number) {
  return fetchApi<Patient>(`/patients/${id}`);
}

export async function createPatient(data: CreatePatientRequest) {
  return fetchApi<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePatient(id: number, data: UpdatePatientRequest) {
  return fetchApi<Patient>(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePatient(id: number) {
  return fetchApi<void>(`/patients/${id}`, {
    method: "DELETE",
  });
}

// Examination API functions
export async function getExaminations() {
  return fetchApi<Examination[]>("/examinations");
}

export async function getExamination(id: number) {
  return fetchApi<Examination>(`/examinations/${id}`);
}

export async function getPatientExaminations(patientId: number) {
  return fetchApi<Examination[]>(`/examinations/patient/${patientId}`);
}

export async function createExamination(data: CreateExaminationRequest) {
  return fetchApi<Examination>("/examinations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExamination(
  id: number,
  data: UpdateExaminationRequest
) {
  return fetchApi<Examination>(`/examinations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExamination(id: number) {
  return fetchApi<void>(`/examinations/${id}`, {
    method: "DELETE",
  });
}

// Sample API functions
export async function getSamples() {
  return fetchApi<Sample[]>("/samples");
}

export async function getSample(id: number) {
  return fetchApi<Sample>(`/samples/${id}`);
}

export async function getExaminationSamples(examinationId: number) {
  return fetchApi<Sample[]>(`/samples/examination/${examinationId}`);
}

export async function createSample(data: SampleRequest) {
  return fetchApi<Sample>("/samples", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSample(id: number, data: UpdateSampleRequest) {
  return fetchApi<Sample>(`/samples/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSample(id: number) {
  return fetchApi<void>(`/samples/${id}`, {
    method: "DELETE",
  });
}

// Prescription API functions
export async function getPrescriptions() {
  return fetchApi<Prescription[]>("/prescriptions");
}

export async function getPrescription(id: number) {
  return fetchApi<Prescription>(`/prescriptions/${id}`);
}

export async function getExaminationPrescriptions(examinationId: number) {
  return fetchApi<Prescription[]>(
    `/prescriptions/examination/${examinationId}`
  );
}

export async function createPrescription(data: PrescriptionRequest) {
  return fetchApi<Prescription>("/prescriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePrescription(
  id: number,
  data: UpdatePrescriptionRequest
) {
  return fetchApi<Prescription>(`/prescriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePrescription(id: number) {
  return fetchApi<void>(`/prescriptions/${id}`, {
    method: "DELETE",
  });
}

export async function validatePrescription(id: number) {
  return fetchApi<{ message: string; prescription: Prescription }>(
    `/prescriptions/${id}/validate`,
    {
      method: "POST",
    }
  );
}

export async function sendPrescription(id: number) {
  return fetchApi<{ message: string; prescription: Prescription }>(
    `/prescriptions/${id}/send`,
    {
      method: "POST",
    }
  );
}

// Referral API functions
export async function getReferrals() {
  return fetchApi<Referral[]>("/referrals");
}

export async function getReferral(id: number) {
  return fetchApi<Referral>(`/referrals/${id}`);
}

export async function getExaminationReferrals(examinationId: number) {
  return fetchApi<Referral[]>(`/referrals/examination/${examinationId}`);
}

export async function createReferral(data: ReferralRequest) {
  return fetchApi<Referral>("/referrals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReferral(id: number, data: UpdateReferralRequest) {
  return fetchApi<Referral>(`/referrals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteReferral(id: number) {
  return fetchApi<void>(`/referrals/${id}`, {
    method: "DELETE",
  });
}

// Type definitions based on the OpenAPI spec
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  details?: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  details?: string;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  details?: string;
}

export interface Examination {
  id: number;
  patientID: number;
  examDate: string;
  anamnesis?: string;
  diagnosis?: string;
}

export interface CreateExaminationRequest {
  patientId: number;
  examDate: string;
  anamnesis?: string;
  diagnosis?: string;
}

export interface UpdateExaminationRequest {
  examDate?: string;
  anamnesis?: string;
  diagnosis?: string;
}

export interface Sample {
  id: number;
  examinationID: number;
  sampleType: string;
  result?: string;
}

export interface SampleRequest {
  examinationId: number;
  sampleType: string;
  result?: string;
}

export interface UpdateSampleRequest {
  sampleType?: string;
  result?: string;
}

export interface Prescription {
  id: number;
  examinationID: number;
  medication: string;
  dosage: string;
  instructions?: string;
  validated: boolean;
  sent: boolean;
}

export interface PrescriptionRequest {
  examinationId: number;
  medication: string;
  dosage: string;
  instructions?: string;
}

export interface UpdatePrescriptionRequest {
  medication?: string;
  dosage?: string;
  instructions?: string;
  validated?: boolean;
  sent?: boolean;
}

export interface Referral {
  id: number;
  examinationID: number;
  specialist: string;
  reason: string;
}

export interface ReferralRequest {
  examinationId: number;
  specialist: string;
  reason: string;
}

export interface UpdateReferralRequest {
  specialist?: string;
  reason?: string;
}
