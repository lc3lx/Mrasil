import { ConfirmModal } from "@/components/ui/confirm-modal";

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
}

export default function OrderConfirmModal(props: OrderConfirmModalProps) {
  return <ConfirmModal {...props} />;
}
