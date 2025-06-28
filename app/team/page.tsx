"use client"

import { useEffect, useState } from "react"
import V7Layout from "@/components/v7/v7-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  Eye,
  Users,
  UserCog,
  Check,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TeamMembersTable from "./TeamMembersTable"
import MemberDetailsDialog from "./MemberDetailsDialog"
import { TeamMemberListItem, useGetAllTeamMembersQuery } from "../api/teamApi"

export default function TeamPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMemberListItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const { data, isLoading, error } = useGetAllTeamMembersQuery()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Ensure we have valid data before rendering
  const members = data?.data?.employees || []

  if (error) {
    return (
      <V7Layout>
        <div className="p-4 text-center text-red-500">
          حدث خطأ أثناء جلب بيانات الفريق
        </div>
      </V7Layout>
    )
  }

  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-600">إدارة الفريق</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">إدارة أعضاء الفريق وصلاحياتهم وأقسامهم</p>
          </div>
          <Button
            onClick={() => router.push(routes.addTeamMember)}
            className="v7-neu-button-accent flex items-center gap-2 bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#2573a7] transition-all duration-300"
          >
            <UserPlus className="h-4 w-4" />
            إضافة عضو جديد
          </Button>
        </div>

        {/* جدول أعضاء الفريق */}
        {isLoading ? (
          <div className="text-center p-4">جاري التحميل...</div>
        ) : (
          <TeamMembersTable 
            members={members}
            onViewDetails={(member) => {
              setSelectedMember(member)
              setIsDialogOpen(true)
            }}
          />
        )}
      </div>

      <MemberDetailsDialog 
        member={selectedMember}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </V7Layout>
  )
}
