"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import V7Layout from "@/components/v7/v7-layout";
import { V7Content } from "@/components/v7/v7-content";
import { HomeContent } from "@/components/v7/pages/home-content";
import { useAuth } from "@/app/providers/AuthProvider";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <V7Layout>
        <AnnouncementBanner />
        <V7Content>
          <HomeContent />
        </V7Content>
      </V7Layout>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
