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
import { getExamination, updateExamination, queryKeys, type UpdateExaminationRequest } from "@/lib/api"
import { formatDateForInput, formatDateForApi } from "@/lib/date-utils"

export default function EditExaminationPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const examinationId = Number.parseInt(id)

  const [error, setError] = useState<string | null>(null)

  const { data: examination, isLoading } = useQuery({
    queryKey: queryKeys.examinations.detail(examinationId),
    queryFn: () => getExamination(examinationId),
    select: (data) => ({
      ...data,
      examDate: formatDateForInput(data.examDate),
    }),
    onError: (err: Error) => {
      setError(`Failed to load examination: ${err.message}`)
    },
  })

  // Initialize formData as an empty object with type assertion
  const [formData, setFormData] = useState<UpdateExaminationRequest>({} as UpdateExaminationRequest)

  // Update formData when examination data is available
  if (examination && Object.keys(formData).length === 0) {
    setFormData(examination)
  }

  const mutation = useMutation({
    mutationFn: (data: UpdateExaminationRequest) => updateExamination(examinationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.examinations.detail(examinationId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.examinations.all })
      router.push("/examinations")
    },
    onError: (err: Error) => {
      setError(`Failed to update examination: ${err.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Format the date for the API
    const formattedData = {
      ...formData,
      examDate: formData.examDate ? formatDateForApi(formData.examDate) : undefined,
    }

    mutation.mutate(formattedData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">Edit Examination</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Examination</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Examination Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examDate">Examination Date</Label>
              <Input
                id="examDate"
                name="examDate"
                type="date"
                value={formData.examDate || ""}
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
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
