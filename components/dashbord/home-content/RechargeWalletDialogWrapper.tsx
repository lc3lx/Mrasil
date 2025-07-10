import RechargeWalletDialog from "@/app/payments/RechargeWalletDialog";

interface RechargeWalletDialogWrapperProps {
  open: boolean;
  onClose: () => void;
}

export default function RechargeWalletDialogWrapper({
  open,
  onClose,
}: RechargeWalletDialogWrapperProps) {
  return <RechargeWalletDialog open={open} onClose={onClose} />;
}
