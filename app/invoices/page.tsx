"use client";

import { ModernHeader } from "@/components/modern-header";
import { useState } from "react";
import { Hero } from "./components/Hero";
import { AIFeatureHighlight } from "./components/AIFeatureHighlight";
import { Features } from "./components/Features";
import { Platform } from "./components/Platform";
import { Footer } from "./components/Footer";

export default function InvoicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col px-6"
      style={{ background: "#D4DBE3" }}
    >
      <ModernHeader />
        <Hero/>
        <Features />
        <Platform />
      <Footer />
    </div>
  );
}
