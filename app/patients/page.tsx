"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { getPatients, deletePatient, queryKeys, type Patient } from "@/lib/api"
import { formatDate } from "@/lib/date-utils"

export default function PatientsPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: patients = [], isLoading } = useQuery({
    queryKey: queryKeys.patients.all,
    queryFn: getPatients,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all })
    },
    onError: (err: Error) => {
      setError(`Failed to delete patient: ${err.message}`)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      deleteMutation.mutate(id)
    }
  }

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "birthDate",
      header: "Birth Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("birthDate"))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/patients/${patient.id}`)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
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
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button asChild>
          <Link href="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Link>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          searchColumn="lastName"
          searchPlaceholder="Search by last name..."
        />
      )}
    </div>
  )
}
