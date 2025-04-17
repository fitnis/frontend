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
import { getReferrals, deleteReferral, queryKeys, type Referral } from "@/lib/api"

export default function ReferralsPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: referrals = [], isLoading } = useQuery({
    queryKey: queryKeys.referrals.all,
    queryFn: getReferrals,
    onError: (err: Error) => {
      setError(`Failed to load referrals: ${err.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all })
    },
    onError: (err: Error) => {
      setError(`Failed to delete referral: ${err.message}`)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this referral?")) {
      deleteMutation.mutate(id)
    }
  }

  const columns: ColumnDef<Referral>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "examinationID",
      header: "Examination ID",
    },
    {
      accessorKey: "specialist",
      header: "Specialist",
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = row.getValue("reason") as string
        return reason.length > 50 ? `${reason.substring(0, 50)}...` : reason
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const referral = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/referrals/${referral.id}`)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(referral.id)}>
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
        <h1 className="text-3xl font-bold">Referrals</h1>
        <Button asChild>
          <Link href="/referrals/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Referral
          </Link>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={referrals}
          searchColumn="specialist"
          searchPlaceholder="Search by specialist..."
        />
      )}
    </div>
  )
}
