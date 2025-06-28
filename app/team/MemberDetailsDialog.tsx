import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TeamMemberListItem, TeamMemberDetails, useGetTeamMemberDetailsQuery } from "../api/teamApi"
import moment from 'moment'
import 'moment/locale/ar'

interface MemberDetailsDialogProps {
  member: TeamMemberListItem | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function MemberDetailsDialog({ member, isOpen, onOpenChange }: MemberDetailsDialogProps) {
  const { data: details, isLoading } = useGetTeamMemberDetailsQuery(member?._id || '', {
    skip: !member?._id || !isOpen
  })

  // Set moment to use Arabic locale
  moment.locale('ar')

  if (!member) return null

  const memberDetails = details?.data

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-[#EFF2F7] border border-gray-200 shadow-lg rounded-xl">
        <DialogHeader className="sticky top-0 z-10 bg-[#EFF2F7] pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-[#294D8B] flex items-center justify-center py-4">
            <span className="px-6">تفاصيل العضو</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-8 text-center">جاري التحميل...</div>
        ) : memberDetails ? (
          <div className="grid grid-cols-1 gap-6 px-8 py-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="v7-neu-card rounded-xl p-4">
              <div className="space-y-3">
                {/* Basic Information */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">الاسم الكامل:</span>
                  <span>{memberDetails.fullName || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">رقم الهوية:</span>
                  <span>{memberDetails.idNumber || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">تاريخ الميلاد:</span>
                  <span>{memberDetails.birthDate ? moment(memberDetails.birthDate).format('DD MMMM YYYY') : '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">الجنس:</span>
                  <span>{memberDetails.gender ? (memberDetails.gender === 'male' ? 'ذكر' : 'أنثى') : '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">الجنسية:</span>
                  <span>{memberDetails.nationality || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <span>{memberDetails.email || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">رقم الهاتف:</span>
                  <span>{memberDetails.phoneNumber || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">العنوان:</span>
                  <span>{memberDetails.address || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">تاريخ التعيين:</span>
                  <span>{memberDetails.hireDate ? moment(memberDetails.hireDate).format('DD MMMM YYYY') : '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">المدير المباشر:</span>
                  <span>{memberDetails.directManager || '-----'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">الراتب:</span>
                  <span>{(memberDetails.salary || 0).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">حالة الراتب:</span>
                  <Badge className={memberDetails.salaryStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}>
                    {memberDetails.salaryStatus === 'pending' ? 'معلق' : 'مدفوع'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">بدل سكن:</span>
                  <span>{(memberDetails.housingAllowance || 0).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">بدل مواصلات:</span>
                  <span>{(memberDetails.transportationAllowance || 0).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">بدلات أخرى:</span>
                  <span>{(memberDetails.otherAllowances || 0).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">الحالة:</span>
                  <Badge
                    className={`${
                      memberDetails.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {memberDetails.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>

                {/* Documents Section */}
                {(memberDetails.educationCertificates.length > 0 ||
                  memberDetails.experienceCertificates.length > 0 ||
                  memberDetails.otherDocuments.length > 0) && (
                  <div className="pt-4">
                    <h3 className="font-semibold mb-3">المستندات</h3>
                    {memberDetails.educationCertificates.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium block mb-2">الشهادات التعليمية:</span>
                        <div className="flex flex-wrap gap-2">
                          {memberDetails.educationCertificates.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {memberDetails.experienceCertificates.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium block mb-2">شهادات الخبرة:</span>
                        <div className="flex flex-wrap gap-2">
                          {memberDetails.experienceCertificates.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {memberDetails.otherDocuments.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">مستندات أخرى:</span>
                        <div className="flex flex-wrap gap-2">
                          {memberDetails.otherDocuments.map((doc, index) => (
                            <Badge key={index} variant="outline">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-red-500">
            حدث خطأ أثناء تحميل البيانات
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 