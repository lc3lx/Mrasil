import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGetNotificationByIdQuery } from "@/app/api/notificationsApi";

interface NotificationDetailsModalProps {
  notificationId: string | null;
  open: boolean;
  onClose: () => void;
}

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({ notificationId, open, onClose }) => {
  const { data, isLoading, error } = useGetNotificationByIdQuery(notificationId!, { skip: !notificationId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تفاصيل الإشعار</DialogTitle>
        </DialogHeader>
        {isLoading && <div>جاري التحميل...</div>}
        {error && <div>حدث خطأ أثناء جلب التفاصيل</div>}
        {data && (
          <div className="space-y-2">
            <div><strong>النوع:</strong> {data.type}</div>
            <div><strong>الرسالة:</strong> {data.message}</div>
            <div><strong>الحالة:</strong> {data.readStatus ? "مقروء" : "غير مقروء"}</div>
            <div><strong>التاريخ:</strong> {data.timestamp}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetailsModal; 