import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { TeamMemberListItem, useDeleteTeamMemberMutation } from "../api/teamApi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface TeamMembersTableProps {
  members: TeamMemberListItem[]
  onViewDetails: (member: TeamMemberListItem) => void
}

export default function TeamMembersTable({ members, onViewDetails }: TeamMembersTableProps) {
  const [deleteTeamMember] = useDeleteTeamMemberMutation()
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberListItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    if (!memberToDelete) return

    try {
      await deleteTeamMember(memberToDelete._id).unwrap()
      toast.success("تم حذف العضو بنجاح")
      setIsDeleteDialogOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف العضو")
    }
  }

  if (!Array.isArray(members)) {
    return (
      <div className="text-center p-4">
        لا توجد بيانات متاحة
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl v7-neu-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  العضو
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  البريد الإلكتروني
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  رقم الهوية
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  العنوان
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  الحالة
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-black dark:text-white">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    لا يوجد أعضاء حالياً
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {member.fullName || member.name || "-----"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{member.email || "-----"}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{member.idNumber || "-----"}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{member.address || "-----"}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge
                        className={`${
                          member.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {member.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => onViewDetails(member)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-md transition-colors duration-200"
                          aria-label="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/team/${member._id}/edit`}
                          className="p-2 text-gray-600 hover:text-gray-800 rounded-md"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setMemberToDelete(member)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="p-2 text-red-600 hover:text-red-800 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-4">تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="text-center mb-6">
            <p className="text-gray-600">
              هل أنت متأكد من حذف العضو{" "}
              <span className="font-semibold text-gray-900">{memberToDelete?.fullName || memberToDelete?.name}</span>؟
            </p>
            <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
          <DialogFooter className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setMemberToDelete(null)
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 