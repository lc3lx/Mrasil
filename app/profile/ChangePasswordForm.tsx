"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useChangePasswordMutation } from "../api/profileApi"
import ResponseModal from "../components/ResponseModal"
import { Save } from "lucide-react"

const formSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

export default function ChangePasswordForm() {
  const [changePassword] = useChangePasswordMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [responseData, setResponseData] = useState<{
    status: 'success' | 'fail'
    message: string
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        password: values.newPassword,
        confirmPassword: values.confirmPassword
      }).unwrap()

      setResponseData({
        status: 'success',
        message: response.msg || 'تم تغيير كلمة المرور بنجاح'
      })
      setIsModalOpen(true)
      form.reset()
    } catch (error: any) {
      setResponseData({
        status: 'fail',
        message: error.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور'
      })
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الحالية</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center py-3 text-base font-semibold bg-[#165a8f] text-white rounded-lg hover:bg-[#1a6bb8] transition-colors gap-2"
            disabled={form.formState.isSubmitting}
          >
            <Save className="h-5 w-5" />
            {form.formState.isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
          </Button>
        </form>
      </Form>

      {responseData && (
        <ResponseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          status={responseData.status}
          message={responseData.message}
        />
      )}
    </>
  )
} 