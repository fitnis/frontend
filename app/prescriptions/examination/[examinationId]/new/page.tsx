"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorMessage } from "@/components/error-message"
import { createPrescription, queryKeys, type PrescriptionRequest } from "@/lib/api"

export default function NewPrescriptionPage() {
  const params = useParams()
  const { examinationId } = params as { examinationId: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const examId = Number.parseInt(examinationId)

  const [formData, setFormData] = useState<PrescriptionRequest>({
    examinationId: examId,
    medication: "",
    dosage: "",
    instructions: "",
  })
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.byExamination(examId) })
      router.push(`/prescriptions/examination/${examinationId}`)
    },
    onError: (err: Error) => {
      setError(`Failed to create prescription: ${err.message}`)
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Add New Prescription for Examination #{examinationId}</h1>

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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/prescriptions/examination/${examinationId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Prescription"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
