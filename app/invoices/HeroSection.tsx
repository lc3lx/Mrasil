import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between w-full min-h-[400px] md:min-h-[440px] py-8 md:py-16">
      {/* Left: Headline and button only */}
      <div className="flex-1 flex flex-col items-start justify-center text-right px-2 md:px-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#23272E] leading-snug mb-4">
          حلول ذكية لشحن وإدارة شحنات المتاجر<br />الإلكترونية بأفضل الأسعار
        </h1>
        <button className="bg-[#13294B] hover:bg-[#0d1e33] text-white font-bold rounded-md px-8 py-3 text-base md:text-lg mt-2 shadow-md transition">
          ارسل شحنتك الآن
        </button>
      </div>

      {/* Right: Laptop image only */}
      <div className="flex-1 flex items-center justify-center w-full md:w-auto">
        <Image
          src="/torod-ar.gif"
          alt="حلول ذكية لشحن وإدارة شحنات المتاجر"
          width={500}
          height={350}
          className="object-contain"
          priority
        />
      </div>
    </section>
  )
} 