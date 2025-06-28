import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { ShipmentHistoryContent } from "@/components/v7/pages/shipment-history-content"

export default function HistoryPage() {
  return (
    <V7Layout>
      <V7Content title="سجل الشحنات" description="عرض تاريخ جميع الشحنات السابقة">
        <ShipmentHistoryContent />
      </V7Content>
    </V7Layout>
  )
}
