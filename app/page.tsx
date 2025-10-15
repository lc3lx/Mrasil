"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import V7Layout from "@/components/v7/v7-layout";
import { V7Content } from "@/components/v7/v7-content";
import { HomeContent } from "@/components/v7/pages/home-content";
import { useAuth } from "./providers/AuthProvider";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait a bit for the auth state to be properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);

      // If user is not authenticated, redirect to login page
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, 500); // Give auth provider time to initialize

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show dashboard only if authenticated
  if (isAuthenticated) {
    return (
      <V7Layout>
        {/* Announcement Banner */}
        <AnnouncementBanner />
        
        <V7Content>
          {/* زر مؤقت للانتقال للداشبورد */}
          {user && (user.role === 'admin' || user.email?.includes('admin')) && (
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
              >
                الانتقال للداشبورد
              </button>
            </div>
          )}
          <HomeContent />
        </V7Content>
      </V7Layout>
    );
  }

  // This should not render if redirecting, but just in case
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
