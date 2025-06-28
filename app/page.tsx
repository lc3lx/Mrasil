import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { HomeContent } from "@/components/v7/pages/home-content"

export default function Home() {
  return (
    <V7Layout>
      <V7Content>
        <HomeContent />
      </V7Content>
    </V7Layout>
  )
}
