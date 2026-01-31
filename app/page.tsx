"use client";

import { ModernHeader } from "@/components/modern-header";
import { useState } from "react";
import { Hero } from "@/app/invoices/components/Hero";
import { AIFeatureHighlight } from "@/app/invoices/components/AIFeatureHighlight";
import { Features } from "@/app/invoices/components/Features";
import { Platform } from "@/app/invoices/components/Platform";
import { Footer } from "@/app/invoices/components/Footer";

export default function RootPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col px-6"
      style={{ background: "#D4DBE3" }}
    >
      <ModernHeader />
      <Hero />
      <Features />
      <Platform />
      <Footer />
    </div>
  );
}
