"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2, CheckCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import {
  getPrescriptions,
  deletePrescription,
  validatePrescription,
  sendPrescription,
  queryKeys,
  type Prescription,
} from "@/lib/api"

export default function PrescriptionsPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: queryKeys.prescriptions.all,
    queryFn: getPrescriptions,
    onError: (err: Error) => {
      setError(`Failed to load prescriptions: ${err.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.all })
    },
    onError: (err: Error) => {
      setError(`Failed to delete prescription: ${err.message}`)
    },
  })

  const validateMutation = useMutation({
    mutationFn: validatePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.all })
    },
    onError: (err: Error) => {
      setError(`Failed to validate prescription: ${err.message}`)
    },
  })

  const sendMutation = useMutation({
    mutationFn: sendPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions.all })
    },
    onError: (err: Error) => {
      setError(`Failed to send prescription: ${err.message}`)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleValidate = async (id: number) => {
    validateMutation.mutate(id)
  }

  const handleSend = async (id: number) => {
    sendMutation.mutate(id)
  }

  const columns: ColumnDef<Prescription>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "examinationID",
      header: "Examination ID",
    },
    {
      accessorKey: "medication",
      header: "Medication",
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
    },
    {
      accessorKey: "validated",
      header: "Validated",
      cell: ({ row }) => {
        const validated = row.getValue("validated") as boolean
        return validated ? "Yes" : "No"
      },
    },
    {
      accessorKey: "sent",
      header: "Sent",
      cell: ({ row }) => {
        const sent = row.getValue("sent") as boolean
        return sent ? "Yes" : "No"
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const prescription = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/prescriptions/${prescription.id}`)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            {!prescription.validated && (
              <Button variant="ghost" size="icon" onClick={() => handleValidate(prescription.id)}>
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Validate</span>
              </Button>
            )}
            {prescription.validated && !prescription.sent && (
              <Button variant="ghost" size="icon" onClick={() => handleSend(prescription.id)}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleDelete(prescription.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <Button asChild>
          <Link href="/prescriptions/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Prescription
          </Link>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={prescriptions}
          searchColumn="medication"
          searchPlaceholder="Search by medication..."
        />
      )}
    </div>
  )
}
