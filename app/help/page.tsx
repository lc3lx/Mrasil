import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, MessageSquare, FileText, Video, BookOpen } from "lucide-react"

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#294D8B]">مركز المساعدة</h1>
          <p className="text-muted-foreground">نحن هنا لمساعدتك في كل ما تحتاجه للاستفادة القصوى من منصة الشحن</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث عن سؤال أو موضوع..."
            className="pr-10 bg-[#EFF2F7] border-0 shadow-inner h-12 text-right"
          />
        </div>

        <Tabs defaultValue="faq" dir="rtl" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
            <TabsTrigger value="guides">أدلة الاستخدام</TabsTrigger>
            <TabsTrigger value="videos">فيديوهات تعليمية</TabsTrigger>
            <TabsTrigger value="contact">اتصل بنا</TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="text-[#294D8B]">الشحن والتوصيل</CardTitle>
                  <CardDescription>أسئلة متعلقة بعمليات الشحن والتوصيل</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-right">كيف يمكنني تتبع شحنتي؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        يمكنك تتبع شحنتك بسهولة من خلال الضغط على قسم "التتبع" في القائمة الجانبية، ثم إدخال رقم الشحنة
                        في حقل البحث. ستظهر لك تفاصيل حالة الشحنة ومكانها الحالي ومسار رحلتها.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-right">ما هي خيارات الشحن المتاحة؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        توفر منصتنا عدة خيارات للشحن تشمل: الشحن العادي (2-5 أيام عمل)، الشحن السريع (1-2 يوم عمل)،
                        والشحن الفوري (نفس اليوم). تختلف الأسعار والتغطية الجغرافية حسب الخيار المختار.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-right">كيف أقوم بإنشاء شحنة جديدة؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        لإنشاء شحنة جديدة، انتقل إلى قسم "إنشاء شحنة" من القائمة الجانبية، ثم قم بتعبئة البيانات
                        المطلوبة مثل عنوان المرسل والمستلم وتفاصيل الطرد. بعد ذلك اختر شركة الشحن المناسبة واضغط على
                        "إنشاء الشحنة".
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="text-[#294D8B]">الحساب والإعدادات</CardTitle>
                  <CardDescription>أسئلة متعلقة بإدارة الحساب والإعدادات</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-right">كيف يمكنني تغيير كلمة المرور؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        لتغيير كلمة المرور، انتقل إلى صفحة "الإعدادات" من القائمة الجانبية، ثم اختر تبويب "الأمان". ستجد
                        خيار تغيير كلمة المرور حيث يمكنك إدخال كلمة المرور الحالية والجديدة.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-right">كيف أقوم بتحديث معلومات الشركة؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        يمكنك تحديث معلومات الشركة من خلال الانتقال إلى "الإعدادات" ثم اختيار تبويب "معلومات الشركة". قم
                        بتعديل البيانات المطلوبة واضغط على "حفظ التغييرات".
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-right">كيف يمكنني إضافة مستخدمين جدد للحساب؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        لإضافة مستخدمين جدد، انتقل إلى قسم "الفريق" من القائمة الجانبية، ثم اضغط على زر "إضافة عضو
                        جديد". قم بتعبئة بيانات المستخدم وتحديد صلاحياته ثم اضغط على "إضافة".
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="text-[#294D8B]">الفواتير والمدفوعات</CardTitle>
                  <CardDescription>أسئلة متعلقة بالفواتير وطرق الدفع</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-right">كيف يمكنني الاطلاع على فواتيري؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        يمكنك الاطلاع على جميع الفواتير من خلال قسم "الفواتير" في القائمة الجانبية. ستجد قائمة بجميع
                        الفواتير مع إمكانية تصفيتها حسب التاريخ أو الحالة.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-right">ما هي طرق الدفع المتاحة؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        تدعم منصتنا عدة طرق للدفع تشمل: البطاقات الائتمانية (فيزا، ماستركارد)، مدى، آبل باي، والتحويل
                        البنكي. يمكنك إدارة طرق الدفع من خلال قسم "المدفوعات" في الإعدادات.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-right">كيف يمكنني شحن رصيد المحفظة؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        لشحن رصيد المحفظة، انتقل إلى صفحة "المحفظة" من القائمة الجانبية، ثم اضغط على زر "شحن الرصيد".
                        اختر المبلغ وطريقة الدفع المناسبة ثم أكمل عملية الدفع.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="text-[#294D8B]">التكامل والواجهات البرمجية</CardTitle>
                  <CardDescription>أسئلة متعلقة بالتكامل مع الأنظمة الأخرى</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-right">
                        كيف يمكنني ربط متجري الإلكتروني بالمنصة؟
                      </AccordionTrigger>
                      <AccordionContent className="text-right">
                        يمكنك ربط متجرك الإلكتروني من خلال قسم "التكاملات" في القائمة الجانبية. نحن ندعم التكامل مع
                        منصات مثل سلة، شوبيفاي، ووكومرس وغيرها. اتبع الخطوات الموضحة لكل منصة لإتمام عملية الربط.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-right">
                        كيف يمكنني استخدام واجهة برمجة التطبيقات (API)؟
                      </AccordionTrigger>
                      <AccordionContent className="text-right">
                        للاستفادة من واجهة برمجة التطبيقات، انتقل إلى قسم "API" في القائمة الجانبية. ستجد توثيقًا كاملًا
                        للواجهة البرمجية مع أمثلة للاستخدام ومفاتيح API الخاصة بك.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-right">هل يمكنني إعداد إشعارات Webhook؟</AccordionTrigger>
                      <AccordionContent className="text-right">
                        نعم، يمكنك إعداد إشعارات Webhook من خلال قسم "Webhooks" في القائمة الجانبية. حدد الأحداث التي
                        ترغب في تلقي إشعارات عنها وأدخل عنوان URL الذي سيتم إرسال الإشعارات إليه.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل البدء السريع</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    تعرف على كيفية إعداد حسابك وبدء استخدام المنصة بسرعة
                  </p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل إدارة الشحنات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">تعلم كيفية إنشاء وإدارة الشحنات بكفاءة</p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل التقارير والتحليلات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    استفد من تقارير وتحليلات المنصة لتحسين أداء أعمالك
                  </p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل إدارة العملاء</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">تعلم كيفية إدارة قاعدة عملائك وتحسين تجربتهم</p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل التكامل مع المتاجر</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">خطوات ربط متجرك الإلكتروني مع منصة الشحن</p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#294D8B]" />
                    <span>دليل المرتجعات والاستبدال</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">إدارة عمليات المرتجعات والاستبدال بكفاءة</p>
                  <Button variant="outline" className="w-full">
                    عرض الدليل
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#294D8B]" />
                    <span>مقدمة للمنصة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">نظرة عامة على منصة الشحن وميزاتها الرئيسية</p>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#294D8B]" />
                    <span>إنشاء وإدارة الشحنات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">شرح تفصيلي لكيفية إنشاء وإدارة الشحنات</p>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#294D8B]" />
                    <span>إعداد التكاملات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">خطوات ربط المنصة مع المتاجر الإلكترونية وأنظمة أخرى</p>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#294D8B]" />
                    <span>استخدام التقارير والتحليلات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">كيفية الاستفادة من التقارير لتحسين أداء أعمالك</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <MessageSquare className="h-6 w-6 text-[#294D8B]" />
                    <span>المحادثة المباشرة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-muted-foreground">تحدث مع فريق الدعم مباشرة</p>
                  <Button className="bg-[#294D8B] hover:bg-[#1e3a6a]">بدء المحادثة</Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Mail className="h-6 w-6 text-[#294D8B]" />
                    <span>البريد الإلكتروني</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-muted-foreground">أرسل استفسارك عبر البريد الإلكتروني</p>
                  <Button className="bg-[#294D8B] hover:bg-[#1e3a6a]">إرسال بريد إلكتروني</Button>
                </CardContent>
              </Card>

              <Card className="bg-[#EFF2F7] border-0 shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Phone className="h-6 w-6 text-[#294D8B]" />
                    <span>الاتصال الهاتفي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-muted-foreground">تحدث مع فريق الدعم عبر الهاتف</p>
                  <Button className="bg-[#294D8B] hover:bg-[#1e3a6a]">اتصل بنا</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-[#EFF2F7] border-0 shadow">
              <CardHeader>
                <CardTitle className="text-[#294D8B]">إرسال استفسار</CardTitle>
                <CardDescription>أرسل استفسارك وسنقوم بالرد عليك في أقرب وقت ممكن</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        الاسم
                      </label>
                      <Input id="name" placeholder="أدخل اسمك" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        البريد الإلكتروني
                      </label>
                      <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" className="bg-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      الموضوع
                    </label>
                    <Input id="subject" placeholder="أدخل موضوع الاستفسار" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" className="bg-[#294D8B] hover:bg-[#1e3a6a]">
                    إرسال الاستفسار
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
