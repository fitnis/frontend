"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { getPatients, createExamination, queryKeys, type CreateExaminationRequest } from "@/lib/api"
import { formatDateForApi } from "@/lib/date-utils"

export default function NewExaminationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<CreateExaminationRequest>({
    patientId: 0,
    examDate: new Date().toISOString().split("T")[0],
    anamnesis: "",
    diagnosis: "",
  })
  const [error, setError] = useState<string | null>(null)

  const { data: patients = [], isLoading } = useQuery({
    queryKey: queryKeys.patients.all,
    queryFn: getPatients,
    onSuccess: (data) => {
      if (data.length > 0 && formData.patientId === 0) {
        setFormData((prev) => ({ ...prev, patientId: data[0].id }))
      }
    },
    onError: (err: Error) => {
      setError(`Failed to load patients: ${err.message}`)
    },
  })

  const mutation = useMutation({
    mutationFn: createExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examinations.all })
      router.push("/examinations")
    },
    onError: (err: Error) => {
      setError(`Failed to create examination: ${err.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, patientId: Number.parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Format the date for the API
    const formattedData = {
      ...formData,
      examDate: formatDateForApi(formData.examDate),
    }

    mutation.mutate(formattedData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">Add New Examination</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Add New Examination</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Examination Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <Select value={formData.patientId.toString()} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Examination Date</Label>
              <Input
                id="examDate"
                name="examDate"
                type="date"
                value={formData.examDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnesis">Anamnesis</Label>
              <Textarea
                id="anamnesis"
                name="anamnesis"
                value={formData.anamnesis || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/examinations")}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Examination"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
