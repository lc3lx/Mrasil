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
        className="relative overflow-hidden shadow-lg"
        style={{
          backgroundColor: currentAnnouncement.backgroundColor,
          color: currentAnnouncement.textColor,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>

        <div className="relative px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Content */}
            <div className="flex items-center space-x-3 space-x-reverse flex-1 min-w-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex-shrink-0"
              >
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>

              <motion.div
                key={currentAnnouncement._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 min-w-0 ${currentAnnouncement.fontSize}`}
              >
                <div className="font-bold mb-1 truncate sm:whitespace-normal">
                  {currentAnnouncement.title}
                </div>
                <div className="opacity-90 text-sm sm:text-base truncate sm:whitespace-normal">
                  {currentAnnouncement.content}
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 ml-4">
              {/* Navigation for multiple announcements */}
              {visibleAnnouncements.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="الإعلان السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex space-x-1 space-x-reverse">
                    {visibleAnnouncements.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`الإعلان ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNext}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="الإعلان التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Dismiss buttons */}
              <button
                onClick={() => dismissAnnouncement(currentAnnouncement._id)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="إخفاء هذا الإعلان"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar for auto-rotation */}
          {visibleAnnouncements.length > 1 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30"
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
