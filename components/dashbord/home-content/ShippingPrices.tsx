import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ShippingPricesProps {
  shipmentCompanyInfo: any[];
  shipmentCompanyInfoLoading: boolean;
}

export default function ShippingPrices({
  shipmentCompanyInfo,
  shipmentCompanyInfoLoading,
}: ShippingPricesProps) {
  return (
    <Card className="v7-neu-card overflow-hidden border-none">
      <CardHeader className="pb-0">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#294D8B] -mt-1">
            أسعار الشحن
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {shipmentCompanyInfoLoading ? (
          <div className="text-center p-4">جاري تحميل أسعار الشحن...</div>
        ) : shipmentCompanyInfo && Array.isArray(shipmentCompanyInfo) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from(
              new Map(
                shipmentCompanyInfo.map((company) => [
                  company.name?.toLowerCase(),
                  company,
                ])
              ).values()
            ).map((company, idx) => {
              const name = company.name?.toLowerCase() || "";
              let imgSrc = "/placeholder-logo.png";
              if (name.includes("aramex")) imgSrc = "/Aramex.jpg";
              else if (name.includes("smsa")) imgSrc = "/smsa_b2c.jpg";
              else if (name.includes("imile"))
                imgSrc = "/carriers/imile-logo.png";
              else if (name.includes("fedex"))
                imgSrc = "/carriers/fedex-logo.png";
              else if (name.includes("dhl")) imgSrc = "/carriers/dhl-logo.png";
              else if (name.includes("ups")) imgSrc = "/carriers/ups-logo.png";
              else if (name.includes("redbox")) imgSrc = "/RedBox.jpg";
              else if (name.includes("omniclama")) imgSrc = "/omniclama.png";
              return (
                <div
                  key={company.name + idx}
                  className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm"
                >
                  <img
                    src={imgSrc}
                    alt={company.name}
                    className="h-12 mb-2 object-contain"
                  />
                  <div className="font-bold text-[#294D8B] mb-2">
                    {company.name}
                  </div>
                  <div className="w-full">
                    {company.shippingTypes &&
                    company.shippingTypes.length > 0 ? (
                      <ul className="text-sm w-full">
                        {company.shippingTypes.map(
                          (
                            type: { type: string; price: number | string },
                            i: number
                          ) => (
                            <li
                              key={type.type + i}
                              className="flex justify-between border-b py-1 last:border-b-0"
                            >
                              <span>{type.type}</span>
                              <span className="font-bold text-[#3498db]">
                                {type.price} ريال
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <div className="text-gray-400 text-xs">
                        لا توجد أنواع شحن متاحة
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-4">لا توجد بيانات شركات شحن</div>
        )}
        <div className="mt-4 text-xs text-gray-500 text-center">
          * الأسعار تشمل الضريبة وتختلف حسب الوزن والمسافة
        </div>
      </CardContent>
    </Card>
  );
}
