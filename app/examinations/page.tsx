"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2, FlaskRoundIcon as Flask, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { getExaminations, deleteExamination, queryKeys, type Examination } from "@/lib/api"
import { formatDate } from "@/lib/date-utils"

export default function ExaminationsPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: examinations = [], isLoading } = useQuery({
    queryKey: queryKeys.examinations.all,
    queryFn: getExaminations,
    onError: (err: Error) => {
      setError(`Failed to load examinations: ${err.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examinations.all })
    },
    onError: (err: Error) => {
      setError(`Failed to delete examination: ${err.message}`)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this examination?")) {
      deleteMutation.mutate(id)
    }
  }

  const columns: ColumnDef<Examination>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "patientID",
      header: "Patient ID",
    },
    {
      accessorKey: "examDate",
      header: "Exam Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("examDate"))
      },
    },
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
      cell: ({ row }) => {
        const diagnosis = row.getValue("diagnosis") as string
        return diagnosis ? diagnosis : "Not diagnosed"
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const examination = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/examinations/${examination.id}`)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push(`/samples/examination/${examination.id}`)}>
              <Flask className="h-4 w-4" />
              <span className="sr-only">Samples</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/prescriptions/examination/${examination.id}`)}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Prescriptions</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push(`/referrals/examination/${examination.id}`)}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Referrals</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(examination.id)}>
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
        <h1 className="text-3xl font-bold">Examinations</h1>
        <Button asChild>
          <Link href="/examinations/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Examination
          </Link>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={examinations}
          searchColumn="patientID"
          searchPlaceholder="Search by patient ID..."
        />
      )}
    </div>
  )
}
