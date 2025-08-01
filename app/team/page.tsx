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
  return (
    <V7Layout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="text-4xl md:text-6xl font-extrabold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            قريبا الاطلاق ...........
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
            we are coming soon
          </div>
        </div>
      </div>
    </V7Layout>
  )
}
