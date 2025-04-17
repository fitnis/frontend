"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { getExaminationSamples, deleteSample, queryKeys, type Sample } from "@/lib/api"

export default function ExaminationSamplesPage() {
  const params = useParams()
  const { examinationId } = params as { examinationId: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const examId = Number.parseInt(examinationId)

  const [error, setError] = useState<string | null>(null)

  const { data: samples = [], isLoading } = useQuery({
    queryKey: queryKeys.samples.byExamination(examId),
    queryFn: () => getExaminationSamples(examId),
    onError: (err: Error) => {
      setError(`Failed to load samples: ${err.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.byExamination(examId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.samples.all })
    },
    onError: (err: Error) => {
      setError(`Failed to delete sample: ${err.message}`)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this sample?")) {
      deleteMutation.mutate(id)
    }
  }

  const columns: ColumnDef<Sample>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "sampleType",
      header: "Sample Type",
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => {
        const result = row.getValue("result") as string
        return result ? result : "Pending"
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const sample = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/samples/${sample.id}`)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(sample.id)}>
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
        <h1 className="text-3xl font-bold">Samples for Examination #{examinationId}</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/samples/examination/${examinationId}/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Sample
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/examinations">Back to Examinations</Link>
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={samples}
          searchColumn="sampleType"
          searchPlaceholder="Search by sample type..."
        />
      )}
    </div>
  )
}
