import V7Layout from "@/components/v7/v7-layout"
import { CarrierIntegrationForm } from "@/components/v7/pages/carrier-integration-form"

export default function CarrierIntegrationPage({ params }: { params: { id: string } }) {
  return (
    <V7Layout>
      <CarrierIntegrationForm id={params.id} />
    </V7Layout>
  )
}
