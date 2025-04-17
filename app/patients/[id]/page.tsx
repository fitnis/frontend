"use client";

import type React from "react";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorMessage } from "@/components/error-message";
import {
  getPatient,
  updatePatient,
  queryKeys,
  type UpdatePatientRequest,
} from "@/lib/api";
import { formatDateForInput, formatDateForApi } from "@/lib/date-utils";

export default function EditPatientPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const patientId = Number.parseInt(id);

  const [error, setError] = useState<string | null>(null);

  const { data: patient, isLoading } = useQuery({
    queryKey: queryKeys.patients.detail(patientId),
    queryFn: () => getPatient(patientId),
    select: (data) => ({
      ...data,
      birthDate: formatDateForInput(data.birthDate),
    }),
  });

  // Initialize formData as an empty object with type assertion
  const [formData, setFormData] = useState<UpdatePatientRequest>(
    {} as UpdatePatientRequest
  );

  // Update formData when patient data is available
  if (patient && Object.keys(formData).length === 0) {
    setFormData(patient);
  }

  const mutation = useMutation({
    mutationFn: (data: UpdatePatientRequest) => updatePatient(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.detail(patientId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
      router.push("/patients");
    },
    onError: (err: Error) => {
      setError(`Failed to update patient: ${err.message}`);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format the date for the API
    const formattedData = {
      ...formData,
      birthDate: formData.birthDate
        ? formatDateForApi(formData.birthDate)
        : undefined,
    };

    mutation.mutate(formattedData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">Edit Patient</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Patient</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/patients")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
