import Link from "next/link"
import { Activity } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Medical App</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="/patients" className="text-sm font-medium hover:underline">
            Patients
          </Link>
          <Link href="/examinations" className="text-sm font-medium hover:underline">
            Examinations
          </Link>
          <Link href="/samples" className="text-sm font-medium hover:underline">
            Samples
          </Link>
          <Link href="/prescriptions" className="text-sm font-medium hover:underline">
            Prescriptions
          </Link>
          <Link href="/referrals" className="text-sm font-medium hover:underline">
            Referrals
          </Link>
        </nav>
      </div>
    </header>
  )
}
