"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { useGetActiveAnnouncementsQuery, type Announcement } from "@/app/api/announcementApi";

export default function AnnouncementBanner() {
  const { data: announcements = [], isLoading } = useGetActiveAnnouncementsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement._id)
  );

  // Auto-rotate announcements
  useEffect(() => {
    if (visibleAnnouncements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [visibleAnnouncements.length]);

  // Load dismissed announcements from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed));
    }
  }, []);

  const dismissAnnouncement = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
    
    // If this was the current announcement, move to next
    if (visibleAnnouncements.length > 1 && currentIndex >= visibleAnnouncements.length - 1) {
      setCurrentIndex(0);
    }
  };

  const dismissAll = () => {
    setIsVisible(false);
    const allIds = visibleAnnouncements.map(a => a._id);
    setDismissedIds(prev => [...prev, ...allIds]);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify([...dismissedIds, ...allIds]));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleAnnouncements.length) % visibleAnnouncements.length);
  };

  // Don't render if loading, no announcements, or not visible
  if (isLoading || visibleAnnouncements.length === 0 || !isVisible) {
    return null;
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden shadow-xl mt-4 mx-4 rounded-2xl backdrop-blur-sm border border-white/20"
        style={{
          background: `linear-gradient(135deg, ${currentAnnouncement.backgroundColor}ee, ${currentAnnouncement.backgroundColor}cc)`,
          color: currentAnnouncement.textColor,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative px-6 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Content */}
            <div className="flex items-center space-x-4 space-x-reverse flex-1 min-w-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex-shrink-0 p-2 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
              </motion.div>

              <motion.div
                key={currentAnnouncement._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 min-w-0 ${currentAnnouncement.fontSize}`}
              >
                <div className="font-bold mb-1 truncate sm:whitespace-normal drop-shadow-sm">
                  {currentAnnouncement.title}
                </div>
                <div className="opacity-95 text-sm sm:text-base truncate sm:whitespace-normal drop-shadow-sm">
                  {currentAnnouncement.content}
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3 space-x-reverse flex-shrink-0 ml-6">
              {/* Navigation for multiple announcements */}
              {visibleAnnouncements.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="p-2 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    aria-label="الإعلان السابق"
                  >
                    <ChevronRight className="w-4 h-4 drop-shadow-sm" />
                  </button>
                  
                  <div className="flex space-x-1.5 space-x-reverse px-2">
                    {visibleAnnouncements.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 hover:scale-125 ${
                          index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/60 hover:bg-white/80'
                        }`}
                        aria-label={`الإعلان ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNext}
                    className="p-2 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    aria-label="الإعلان التالي"
                  >
                    <ChevronLeft className="w-4 h-4 drop-shadow-sm" />
                  </button>
                </>
              )}

              {/* Dismiss buttons */}
              <button
                onClick={() => dismissAnnouncement(currentAnnouncement._id)}
                className="p-2 hover:bg-red-500/30 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm group"
                aria-label="إخفاء هذا الإعلان"
              >
                <X className="w-4 h-4 drop-shadow-sm group-hover:text-red-100" />
              </button>
            </div>
          </div>

          {/* Progress bar for auto-rotation */}
          {visibleAnnouncements.length > 1 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/40 to-white/60 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
