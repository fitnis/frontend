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
import { getExaminations, createSample, queryKeys, type SampleRequest } from "@/lib/api"

export default function NewSamplePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<SampleRequest>({
    examinationId: 0,
    sampleType: "",
    result: "",
  })
  const [error, setError] = useState<string | null>(null)

  const { data: examinations = [], isLoading } = useQuery({
    queryKey: queryKeys.examinations.all,
    queryFn: getExaminations,
    onSuccess: (data) => {
      if (data.length > 0 && formData.examinationId === 0) {
        setFormData((prev) => ({ ...prev, examinationId: data[0].id }))
      }
    },
    onError: (err: Error) => {
      setError(`Failed to load examinations: ${err.message}`)
    },
  })

  const mutation = useMutation({
    mutationFn: createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.all })
      router.push("/samples")
    },
    onError: (err: Error) => {
      setError(`Failed to create sample: ${err.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, examinationId: Number.parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">Add New Sample</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Add New Sample</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Sample Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examinationId">Examination</Label>
              <Select value={formData.examinationId.toString()} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an examination" />
                </SelectTrigger>
                <SelectContent>
                  {examinations.map((examination) => (
                    <SelectItem key={examination.id} value={examination.id.toString()}>
                      Examination #{examination.id} - Patient #{examination.patientID}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Button type="button" variant="outline" onClick={() => router.push("/samples")}>
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
