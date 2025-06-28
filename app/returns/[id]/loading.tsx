import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { V7LoadingScreen } from "@/components/v7/v7-loading-screen"

export default function ReturnDetailsLoading() {
  return (
    <V7Layout>
      <V7Content>
        <V7LoadingScreen title="جاري تحميل تفاصيل طلب الرجيع..." />
      </V7Content>
    </V7Layout>
  )
}
