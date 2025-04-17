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
import { getSample, updateSample, queryKeys, type UpdateSampleRequest } from "@/lib/api"

export default function EditSamplePage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const sampleId = Number.parseInt(id)

  const [error, setError] = useState<string | null>(null)

  const { data: sample, isLoading } = useQuery({
    queryKey: queryKeys.samples.detail(sampleId),
    queryFn: () => getSample(sampleId),
    onError: (err: Error) => {
      setError(`Failed to load sample: ${err.message}`)
    },
  })

  // Initialize formData as an empty object with type assertion
  const [formData, setFormData] = useState<UpdateSampleRequest>({} as UpdateSampleRequest)

  // Update formData when sample data is available
  if (sample && Object.keys(formData).length === 0) {
    setFormData({
      sampleType: sample.sampleType,
      result: sample.result || "",
    })
  }

  const mutation = useMutation({
    mutationFn: (data: UpdateSampleRequest) => updateSample(sampleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.samples.detail(sampleId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.all })
      router.push("/samples")
    },
    onError: (err: Error) => {
      setError(`Failed to update sample: ${err.message}`)
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
        <h1 className="mb-6 text-3xl font-bold">Edit Sample</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Sample</h1>

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
              <Label htmlFor="result">Result</Label>
              <Textarea id="result" name="result" value={formData.result || ""} onChange={handleChange} rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/samples")}>
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
