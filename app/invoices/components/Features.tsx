import Image from "next/image";

const features = [
  {
    title: "أسعار الشحن",
    desc: "احصل على أفضل أسعار الشحن لجميع الوجهات مع خيارات متعددة تناسب احتياجاتك.",
    img: "/homePageImages/price.jpeg",
  },
  {
    title: "الربط مع مراسيل",
    desc: "اربط متجرك أو شركتك مع مراسيل بسهولة، واستمتع بإدارة وشحن طلباتك بكفاءة من خلال منصة واحدة تجمع لك أفضل حلول التوصيل.",
    img: "/homePageImages/contact.jpeg",
  },
  {
    title: "تتبع الشحنات و إدارة الطلبات",
    desc: "تابع شحناتك خطوة بخطوة وتحكم بأدارتها عبر منصتنا الذكية، واستمتع بتجربة شحن سلسة وموثوقة",
    img: "/homePageImages/tracking.jpeg",
  },
];

export function Features() {
  return (
    <div className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-16">لماذا مراسيل؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center text-center transition-transform duration-200 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 cursor-pointer group bg-transparent"
            >
              <div className="w-32 h-32 mb-6 flex items-center justify-center bg-transparent">
                <Image
                  src={feature.img}
                  alt={feature.title}
                  className="object-contain w-full h-full"
                  width={128}
                  height={128}
                />
              </div>
              <h3 className="font-extrabold mb-3 text-2xl text-blue-900 group-hover:text-blue-700 transition-all">
                {feature.title}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
