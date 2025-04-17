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
import { getReferral, updateReferral, queryKeys, type UpdateReferralRequest } from "@/lib/api"

export default function EditReferralPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const referralId = Number.parseInt(id)

  const [error, setError] = useState<string | null>(null)

  const { data: referral, isLoading } = useQuery({
    queryKey: queryKeys.referrals.detail(referralId),
    queryFn: () => getReferral(referralId),
    onError: (err: Error) => {
      setError(`Failed to load referral: ${err.message}`)
    },
  })

  // Initialize formData as an empty object with type assertion
  const [formData, setFormData] = useState<UpdateReferralRequest>({} as UpdateReferralRequest)

  // Update formData when referral data is available
  if (referral && Object.keys(formData).length === 0) {
    setFormData({
      specialist: referral.specialist,
      reason: referral.reason,
    })
  }

  const mutation = useMutation({
    mutationFn: (data: UpdateReferralRequest) => updateReferral(referralId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.detail(referralId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all })
      router.push("/referrals")
    },
    onError: (err: Error) => {
      setError(`Failed to update referral: ${err.message}`)
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
        <h1 className="mb-6 text-3xl font-bold">Edit Referral</h1>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Referral</h1>

      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialist">Specialist</Label>
              <Input id="specialist" name="specialist" value={formData.specialist} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={4} required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/referrals")}>
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
