import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export default function OrderStatusBadge({
  status = "pending",
}: {
  status?: string;
}) {
  switch (status) {
    case "completed":
      return (
        <Badge className="v7-neu-badge-success bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 ml-1" />
          مكتمل
        </Badge>
      );
    case "processing":
      return (
        <Badge className="v7-neu-badge-warning bg-sky-50 text-sky-700 border border-sky-200">
          <Clock className="h-3 w-3 ml-1" />
          قيد التنفيذ
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="v7-neu-badge-error bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 ml-1" />
          ملغي
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="v7-neu-badge-info bg-indigo-50 text-indigo-700 border border-indigo-200">
          <AlertCircle className="h-3 w-3 ml-1" />
          معلق
        </Badge>
      );
  }
}
