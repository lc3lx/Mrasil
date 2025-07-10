// components/customer-details.tsx

const getStatusColor = (status: string) => {
  switch (status) {
    case "تم التسليم":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "قيد الشحن":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
    case "قيد المعالجة":
      return "bg-sky-50 text-sky-700 border-sky-200"
    case "ملغي":
      return "bg-rose-50 text-rose-700 border-rose-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}
