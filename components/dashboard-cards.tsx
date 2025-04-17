import Link from "next/link"
import { Users, Stethoscope, FlaskRoundIcon as Flask, FileText, ArrowRight } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCards() {
  const cards = [
    {
      title: "Patients",
      description: "Manage patient records and information",
      icon: <Users className="h-8 w-8" />,
      href: "/patients",
    },
    {
      title: "Examinations",
      description: "Record and view patient examinations",
      icon: <Stethoscope className="h-8 w-8" />,
      href: "/examinations",
    },
    {
      title: "Samples",
      description: "Track laboratory samples and results",
      icon: <Flask className="h-8 w-8" />,
      href: "/samples",
    },
    {
      title: "Prescriptions",
      description: "Create and manage patient prescriptions",
      icon: <FileText className="h-8 w-8" />,
      href: "/prescriptions",
    },
    {
      title: "Referrals",
      description: "Manage specialist referrals",
      icon: <ArrowRight className="h-8 w-8" />,
      href: "/referrals",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {card.icon}
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="text-sm text-primary">View {card.title}</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
