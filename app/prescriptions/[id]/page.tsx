"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { getPrescription, updatePrescription, queryKeys, type UpdatePrescriptionRequest } from "@/lib/api"

export default function EditPrescriptionPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const prescriptionId = Number.parseInt(id)

  const [error, setError] = useState<string | null>(null)

  const { data: prescription, isLoading } = useQuery({
    queryKey: queryKeys.prescriptions.detail(prescriptionId),
    queryFn: () => getPrescription(prescriptionId),
    onError: (err: Error) => {
      setError(`Failed to load prescription: ${err.message}`)
    },
  })

  // Initialize formData as an empty object with type assertion
  const [formData, setFormData] = useState<UpdatePrescriptionRequest>({} as UpdatePrescriptionRequest)

  // Update formData when prescription data is available
  if (prescription && Object.keys(formData).length === 0) {
    setFormData({
      medication: prescription.medication,
      dosage: prescription.dosage,
      instructions: prescription.instructions || "",
    })
  }

  const mutation = useMutation({
    mutationFn: (data: UpdatePrescriptionRequest) => updatePrescription(prescriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.prescriptions.detail(prescriptionId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.all })
      router.push("/prescriptions")
    },
    onError: (err: Error) => {
      setError(`Failed to update prescription: ${err.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">Edit Prescription</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Prescription</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Prescription Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Input id="medication" name="medication" value={formData.medication} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/prescriptions")}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
