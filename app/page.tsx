import { DashboardCards } from "@/components/dashboard-cards"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Medical Application Dashboard</h1>
      <DashboardCards />
    </main>
  )
}
