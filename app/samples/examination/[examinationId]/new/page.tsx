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
import { createSample, queryKeys, type SampleRequest } from "@/lib/api"

export default function NewSamplePage() {
  const params = useParams()
  const { examinationId } = params as { examinationId: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const examId = Number.parseInt(examinationId)

  const [formData, setFormData] = useState<SampleRequest>({
    examinationId: examId,
    sampleType: "",
    result: "",
  })
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.byExamination(examId) })
      router.push(`/samples/examination/${examinationId}`)
    },
    onError: (err: Error) => {
      setError(`Failed to create sample: ${err.message}`)
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
      <h1 className="mb-6 text-3xl font-bold">Add New Sample for Examination #{examinationId}</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Sample Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sampleType">Sample Type</Label>
              <Input id="sampleType" name="sampleType" value={formData.sampleType} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result">Result (Optional)</Label>
              <Textarea id="result" name="result" value={formData.result || ""} onChange={handleChange} rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/samples/examination/${examinationId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Sample"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
