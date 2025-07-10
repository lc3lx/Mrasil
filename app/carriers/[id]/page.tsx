import V7Layout from "@/components/v7/v7-layout"
import { CarrierDetails } from "@/components/v7/pages/carrier-details"

export default function CarrierDetailsPage({ params }: { params: { id: string } }) {
  return (
    <V7Layout>
      <CarrierDetails id={params.id} />
    </V7Layout>
  )
}
