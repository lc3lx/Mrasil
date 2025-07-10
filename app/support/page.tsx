import { DashboardLayout } from "@/components/dashboard-layout"

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">الدعم الفني</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-muted-foreground">خيارات الدعم الفني ستظهر هنا</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
