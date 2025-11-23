"use client";

import { useState, useEffect } from "react";
import { V7Content } from "@/components/v7/v7-content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Palette,
  Truck,
  Code,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Settings,
  Save,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetCustomerMeQuery, useUpdateTrackingSettingsMutation, TrackingSettings } from "@/app/api/customerApi";

export function CustomTrackingContent() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // API hooks
  const { data: customerData, isLoading: isLoadingCustomer } = useGetCustomerMeQuery();
  const [updateTrackingSettings, { isLoading: isSaving }] = useUpdateTrackingSettingsMutation();

  // Default settings
  const defaultSettings: TrackingSettings = {
    companyName: "",
    logo: "/wtshn.jpg",
    primaryColor: "#3498db",
    secondaryColor: "#f8f9fa",
    showHeader: true,
    showFooter: true,
    showMap: true,
    showTimeline: true,
    language: "ar",
    customCss: "",
    customJs: "",
    embedCode:
      "<div id='shipexpress-tracking' data-tracking-id='YOUR_TRACKING_ID'></div><script src='https://tracking.shipexpress.com/embed.js'></script>",
  };

  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings>(defaultSettings);

  // Load settings from API when customer data is available
  useEffect(() => {
    if (customerData?.data?.trackingSettings) {
      setTrackingSettings({
        ...defaultSettings,
        ...customerData.data.trackingSettings,
      });
    }
  }, [customerData]);

  const handleSave = async () => {
    try {
      await updateTrackingSettings(trackingSettings).unwrap();
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات تخصيص التتبع بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في الحفظ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingSettings.embedCode);
    setCopied(true);
    toast({
      title: "تم النسخ",
      description: "تم نسخ كود التضمين بنجاح",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setTrackingSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="companyName"
                    className="text-lg text-black/90 font-semibold"
                  >
                    اسم الشركة
                  </Label>
                  <Input
                    id="companyName"
                    value={trackingSettings.companyName || ""}
                    placeholder="أدخل اسم الشركة"
                    onChange={(e) =>
                      handleSettingChange("companyName", e.target.value)
                    }
                    className="text-gry"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label className="text-black/90 text-xl font-semibold">عناصر الصفحة</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="h-8 w-8 rounded-md bg-[#3498db]/10 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-[#3498db]" />
                      </div>
                      <div>
                        <p className="font-medium text-black/90 text-xl">
                          إظهار الهيدر
                        </p>
                        <p className="text-sm text-gry">شعار وعنوان الصفحة</p>
                      </div>
                    </div>
                    <Switch
                      checked={trackingSettings.showHeader}
                      onCheckedChange={(checked) =>
                        handleSettingChange("showHeader", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="h-8 w-8 rounded-md bg-[#3498db]/10 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-[#3498db]" />
                      </div>
                      <div>
                        <p className="font-medium text-black/90 text-xl">
                          إظهار الفوتر
                        </p>
                        <p className="text-sm text-gry">
                          معلومات الاتصال والحقوق
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={trackingSettings.showFooter}
                      onCheckedChange={(checked) =>
                        handleSettingChange("showFooter", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="h-8 w-8 rounded-md bg-[#3498db]/10 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-[#3498db]" />
                      </div>
                      <div>
                        <p className="font-medium text-black/90 text-xl">
                          إظهار الجدول الزمني
                        </p>
                        <p className="text-sm text-gry">مراحل توصيل الشحنة</p>
                      </div>
                    </div>
                    <Switch
                      checked={trackingSettings.showTimeline}
                      onCheckedChange={(checked) =>
                        handleSettingChange("showTimeline", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor="primaryColor" className="text-base font-semibold">اللون الرئيسي</Label>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: trackingSettings.primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      value={trackingSettings.primaryColor || "#3498db"}
                      onChange={(e) =>
                        handleSettingChange("primaryColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor="secondaryColor" className="text-base font-semibold">لون الخلفية</Label>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{
                        backgroundColor: trackingSettings.secondaryColor,
                      }}
                    />
                    <Input
                      id="secondaryColor"
                      value={trackingSettings.secondaryColor || "#f8f9fa"}
                      onChange={(e) =>
                        handleSettingChange("secondaryColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label htmlFor="logo" className="text-base font-semibold">شعار الشركة</Label>
                <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="h-20 w-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm bg-white">
                    <img
                      src={trackingSettings.logo || "/placeholder.svg"}
                      alt="شعار الشركة"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="logo"
                      value={trackingSettings.logo || ""}
                      onChange={(e) =>
                        handleSettingChange("logo", e.target.value)
                      }
                      placeholder="أدخل رابط الشعار"
                    />
                    <p className="text-xs text-gry">
                      أدخل رابط الشعار أو قم بتحميله
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    تحميل
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "advanced":
        return (
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="customCss" className="text-base font-semibold">CSS مخصص</Label>
                <Textarea
                  id="customCss"
                  placeholder=".tracking-container { ... }"
                  className="font-mono h-32"
                  value={trackingSettings.customCss || ""}
                  onChange={(e) =>
                    handleSettingChange("customCss", e.target.value)
                  }
                />
                <p className="text-xs text-gry">
                  أضف أكواد CSS مخصصة لتخصيص مظهر صفحة التتبع
                </p>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="customJs" className="text-base font-semibold">JavaScript مخصص</Label>
                <Textarea
                  id="customJs"
                  placeholder="document.addEventListener('DOMContentLoaded', function() { ... });"
                  className="font-mono h-32"
                  value={trackingSettings.customJs || ""}
                  onChange={(e) =>
                    handleSettingChange("customJs", e.target.value)
                  }
                />
                <p className="text-xs text-gry">
                  أضف أكواد JavaScript مخصصة لإضافة وظائف إضافية
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <V7Content
      title="تخصيص صفحة التتبع"
      description="قم بتخصيص صفحة تتبع الشحنات لعملائك بما يتناسب مع هوية علامتك التجارية"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="v7-neu-card overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-[#EFF2F7] dark:bg-gray-900 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-[#3498db] text-lg md:text-2xl font-extralight">
                إعدادات التخصيص
              </CardTitle>
              <CardDescription className="text-gry text-xl mt-2">
                قم بتخصيص مظهر صفحة التتبع لعملائك
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* New Tab Navigation Style */}
              <div className="bg-[#F0F2F5] p-3 mx-4 mt-4 rounded-lg">
                <div className="flex justify-between items-center rounded-full overflow-hidden gap-2">
                  <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all ${
                      activeTab === "general"
                        ? "bg-[#eaf4fb] text-[#3498db] rounded-full shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Settings className="h-4 w-4 mx-auto mb-1" />
                    عام
                  </button>
                  <button
                    onClick={() => setActiveTab("appearance")}
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all ${
                      activeTab === "appearance"
                        ? "bg-[#eaf4fb] text-[#3498db] rounded-full shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Palette className="h-4 w-4 mx-auto mb-1" />
                    المظهر
                  </button>
                </div>
              </div>

              {renderTabContent()}
              
              {/* Save Button */}
              <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isLoadingCustomer}
                  className="w-full v7-neu-button"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-8">
            <Card className="v7-neu-card border-none shadow-lg">
              <CardHeader className="bg-[#EFF2F7] dark:bg-gray-900 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-[#3498db] text-2xl">
                  معاينة
                </CardTitle>
                <CardDescription className="text-gry text-lg mt-2">
                  شكل صفحة التتبع
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="border-none rounded-md overflow-hidden">
                  <div className="bg-[#f8f9fa] p-2 border-none flex items-center justify-between">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gry">صفحة التتبع</div>
                  </div>
                  <div className="p-2 bg-white h-[300px] overflow-hidden">
                    <div className="flex flex-col h-full">
                      {trackingSettings.showHeader && (
                        <div
                          className=" p-2 flex items-center justify-between"
                          style={{
                            backgroundColor: trackingSettings.secondaryColor,
                          }}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="h-6 w-6 rounded-sm overflow-hidden">
                              <img
                                src={
                                  trackingSettings.logo || "/placeholder.svg"
                                }
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-lg text-black/90 font-medium">
                              {trackingSettings.companyName}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 p-2 flex flex-col space-y-2 overflow-hidden">
                        <div className="bg-[#f8f9fa] rounded p-2 text-xs">
                          <div className="font-normal text-base text-black/90">
                            رقم التتبع:{" "}
                            <span className="text-[#3498db]">
                              SE123456789SA
                            </span>
                          </div>
                          <div className="text-gry text-base">
                            تم الشحن: 15 أبريل 2023
                          </div>
                        </div>

                        {trackingSettings.showTimeline && (
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <div className="h-2 w-2 rounded-full bg-[#3498db]"></div>
                            <div
                              className="h-0.5 flex-1"
                              style={{
                                backgroundColor: trackingSettings.primaryColor,
                              }}
                            ></div>
                            <div className="h-2 w-2 rounded-full bg-[#3498db]"></div>
                            <div
                              className="h-0.5 flex-1"
                              style={{
                                backgroundColor: trackingSettings.primaryColor,
                              }}
                            ></div>
                            <div className="h-2 w-2 rounded-full bg-[#3498db]"></div>
                            <div className="h-0.5 flex-1 bg-gray-200"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                          </div>
                        )}
                      </div>

                      {trackingSettings.showFooter && (
                        <div
                          className=" p-1 flex justify-center"
                          style={{
                            backgroundColor: trackingSettings.secondaryColor,
                          }}
                        >
                          <div className="text-[10px] text-gry">
                            © {new Date().getFullYear()}{" "}
                            {trackingSettings.companyName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-none v7-neu-card"
                  >
                    <Smartphone className="h-3 w-3 mr-1" />
                    موبايل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-none v7-neu-card"
                  >
                    <Monitor className="h-3 w-3 mr-1" />
                    ديسكتوب
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-none v7-neu-card"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    معاينة كاملة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="v7-neu-card border-none shadow-lg">
              <CardHeader className="bg-[#EFF2F7] dark:bg-gray-900 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-[#3498db] text-lg">
                  كود التضمين
                </CardTitle>
                <CardDescription className="text-gry mt-2">
                  أضف كود التتبع إلى موقعك
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4 ">
                  <div className="relative ">
                    <Textarea
                      value={trackingSettings.embedCode}
                      readOnly
                      className="font-mono text-xs h-24 pr-2"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 left-2"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gry">
                    قم بنسخ هذا الكود وإضافته إلى موقعك لعرض صفحة تتبع الشحنات
                    المخصصة. استبدل{" "}
                    <code className="text-xs bg-[#f8f9fa] px-1 rounded">
                      YOUR_TRACKING_ID
                    </code>{" "}
                    برقم التتبع الخاص بالشحنة.
                  </p>

                  <Button
                    className="w-full text-white "
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </V7Content>
  );
}
