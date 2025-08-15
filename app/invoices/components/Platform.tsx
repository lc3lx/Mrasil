import Image from "next/image";
import { useState, useEffect } from "react";

const companies = [
  {
    name: "سمسا",
    img: "/companies/smsa2.jpg",
  },
  {
    name: "ريدبوكس",
    img: "/companies/redBox2.jpg",
  },
  {
    name: "اراميكس",
    img: "/companies/araMex2.jpg",
  },
  {
    name: "  لاما بوكس",
    img: "/companies/lamaBox2.jpg",
  },

];

const stores = [
  { name: "Shopify", img: "/stores/shopify.png" },
  { name: "WooCommerce", img: "/stores/woo.png" },
  { name: "زد", img: "/stores/zid.png" },
  { name: "سلة", img: "/stores/sala.png" },
];

export function Platform() {
  return (
    <div className="py-16" style={{ background: "#D4DBE3" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-3xl font-extrabold text-blue-900 text-center mb-16">
          أدر جميع شحناتك من منصة واحدة{" "}
        </h2>
        <div className="mb-22 py-16">
          <h3 className="text-center mb-32 text-lg sm:text-2xl font-bold text-blue-800">
            شركات الشحن{" "}
          </h3>
          {/* 3D Circular Slider - Custom style */}
<div className="flex justify-center">
  <div
    className="relative"
    style={{
      perspective: "1000px", // على عنصر كبير مو صغير
    }}
  >
    <div
      className="slider w-40 h-32 sm:w-[180px] sm:h-[150px]"
      style={{
        // @ts-ignore
        "--quantity": companies.length,
      }}
    >
      {companies.map((company, idx) => (
        <span
          key={company.name}
          style={{
            // @ts-ignore
            "--i": idx,
          }}
        >
          <img src={company.img} alt={company.name} />
        </span>
      ))}
    </div>
  </div>
</div>

<style jsx>{`
  .slider {
    position: relative;
    transform-style: preserve-3d;
    animation: rotate 25s linear infinite;
    margin: 0 auto 48px auto;
    --radius: 160px;
  }
    @media (width >= 767px) {
  .slider {
    --radius: 216px; /* أصغر للشاشات الصغيرة */
  }
}
  @keyframes rotate {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
  .slider span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: center;
    transform-style: preserve-3d;
    transform: rotateY(calc(var(--i) * (360deg / var(--quantity))))
      translateZ(var(--radius));
  }
  .slider span img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
    transition: 0.5s;
    -webkit-box-reflect: below 15px
      linear-gradient(transparent, transparent, #0004);
  }
  .slider:hover {
    animation-play-state: paused;
  }
  .slider span:hover img {
    transform: translateY(-30px) scale(1.15);
    z-index: 2;
  }
`}</style>


        </div>
        {/* Stores section as a static row */}
        <div className="mt-20 py-8" style={{ background: "#D4DBE3" }}>
          <div>
            <h3
              className="text-center mb-16 text-xl sm:text-2xl font-bold text-blue-900 my-20 px-4"
              style={{ color: "#294D8B" }}
            >
              المتاجر الإلكترونية
            </h3>
          </div>
          <div className="flex gap-12 justify-center items-center flex-wrap">
            {stores.map((store) => (
              <div
                key={store.name}
                className="flex items-center justify-center sm:min-h-[9rem] sm:min-w-[9rem] max-h-24 max-w-24 "
              >
                <Image
                  src={store.img}
                  alt={store.name}
                  width={1000}
                  height={1000}
                  className="object-contain  w-full h-full "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
