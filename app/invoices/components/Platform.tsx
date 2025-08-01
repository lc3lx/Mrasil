import Image from "next/image";
import { useState, useEffect } from "react";

const companies = [
  {
    name: "سمسا",
    img: "/companies/smsa.jpg",
  },
  {
    name: "ريدبوكس",
    img: "/companies/RedBox.jpg",
  },
  {
    name: "اراميكس",
    img: "/companies/Aramex.jpg",
  },
  {
    name: "اومني لاما",
    img: "/companies/omniclama.png",
  },
  {
    name: "سبل",
    img: "/companies/sbl.jpeg",
  },
];

const stores = [
  { name: "Shopify", img: "/stores/shopify.jpg" },
  { name: "WooCommerce", img: "/stores/woo.jpg" },
  { name: "زد", img: "/stores/zid.jpg" },
  { name: "سلة", img: "/stores/salla.jpg" },
];

export function Platform() {
  return (
    <div className="py-16" style={{ background: "#D4DBE3" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-blue-900 text-center mb-16">
          أدر جميع شحناتك من منصة واحدة{" "}
        </h2>
        <div className="mb-22 py-16">
          <h3 className="text-center mb-24 text-2xl font-bold text-blue-800">
            شركات الشحن{" "}
          </h3>
          {/* 3D Circular Slider - Custom style */}
          <div
            className="slider mb-12 mt-28"
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
            <style jsx>{`
              .slider {
                position: relative;
                width: 180px;
                height: 150px;
                transform-style: preserve-3d;
                animation: rotate 25s linear infinite;
                margin: 0 auto 48px auto;
                --radius: 216px;
              }
              @keyframes rotate {
                0% {
                  transform: perspective(1000px) rotateY(0deg);
                }
                100% {
                  transform: perspective(1000px) rotateY(360deg);
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
                /* توزيع الصور حسب عدد الشركات */
                transform: rotateY(calc(var(--i) * (360deg / var(--quantity))))
                  translateZ(var(--radius));
                display: block;
              }
              .slider span img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 10px;
                object-fit: cover;
                transition: 0.5s;
                -webkit-box-reflect: below 15px
                  linear-gradient(transparent, transparent, #0004);
                box-reflect: below 15px
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
        </div>
        {/* Stores section as a static row */}
        <div className="mt-20 py-8" style={{ background: "#D4DBE3" }}>
          <div>
            <h3
              className="text-center mb-32 text-2xl font-bold text-blue-900 my-20 px-4"
              style={{ color: "#294D8B" }}
            >
              المتاجر الإلكترونية
            </h3>
          </div>
          <div className="flex gap-12 justify-center items-center flex-wrap">
            {stores.map((store) => (
              <div
                key={store.name}
                className="flex items-center justify-center h-40 w-40"
              >
                <Image
                  src={store.img}
                  alt={store.name}
                  width={300}
                  height={300}
                  className="object-contain h-64 w-64"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
