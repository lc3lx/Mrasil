import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { SettingsContent } from "@/components/v7/pages/settings-content"

export default function SettingsPage() {
  return (
    <V7Layout>
      <V7Content title="الإعدادات" description="إدارة إعدادات الحساب والتفضيلات">
        <SettingsContent />
      </V7Content>
    </V7Layout>
  )
}
