"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { V7AIChat } from "./v7-ai-chat"
import { Sparkles, Lightbulb, Move, RotateCcw, Cpu, Zap } from "lucide-react"

export function V7FloatingAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showPositionControls, setShowPositionControls] = useState(false)
  const [position, setPosition] = useState({ x: null, y: null })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [facialExpression, setFacialExpression] = useState("normal")
  const [blinking, setBlinking] = useState(false)

  const { resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || "light"
  const isDark = currentTheme === "dark"

  // مراجع للعناصر والحالة
  const isMountedRef = useRef(true)
  const animationRef = useRef(null)
  const buttonRef = useRef(null)

  // الألوان المتدرجة للأيقونة
  const robotColors = {
    main: "#192A48", // Dark navy blue from the image
    white: "#FFFFFF",
    highlight: "rgba(255, 255, 255, 0.8)",
    glow: "rgba(75, 174, 209, 0.6)",
  }

  // استرجاع الموضع المحفوظ عند التحميل
  useEffect(() => {
    const savedPosition = localStorage.getItem("assistantPosition")
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition)
        // التحقق من أن الموضع داخل حدود الشاشة
        if (isPositionValid(parsedPosition)) {
          setPosition(parsedPosition)
        } else {
          // إذا كان الموضع خارج الحدود، استخدم الموضع الافتراضي
          resetPosition()
        }
      } catch (e) {
        console.error("خطأ في تحليل موضع المساعد المحفوظ:", e)
        resetPosition()
      }
    }

    // استمع لتغييرات حجم النافذة لضمان بقاء الأيقونة داخل الشاشة
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  // تأثير الرمش
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        if (isMountedRef.current) {
          setBlinking(true)
          setTimeout(() => {
            if (isMountedRef.current) {
              setBlinking(false)
            }
          }, 200)
        }
      },
      Math.random() * 3000 + 2000,
    ) // رمش عشوائي كل 2-5 ثوانٍ

    return () => {
      clearInterval(blinkInterval)
    }
  }, [])

  // التحقق من صلاحية الموضع (داخل حدود الشاشة)
  const isPositionValid = (pos) => {
    if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") return false

    // الحصول على أبعاد النافذة
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0

    // التحقق من أن الموضع داخل حدود الشاشة مع هامش
    const margin = 20
    return (
      pos.x >= margin && pos.x <= windowWidth - 75 - margin && pos.y >= margin && pos.y <= windowHeight - 75 - margin
    )
  }

  // معالجة تغيير حجم النافذة
  const handleWindowResize = () => {
    if (position.x !== null && position.y !== null) {
      // التحقق من أن الموضع لا يزال صالحًا بعد تغيير الحجم
      if (!isPositionValid(position)) {
        resetPosition()
      }
    }
  }

  // إعادة تعيين الموضع إلى الافتراضي
  const resetPosition = () => {
    setPosition({ x: null, y: null })
    localStorage.removeItem("assistantPosition")
  }

  // تأثير بدء الرسوم المتحركة
  useEffect(() => {
    const animationInterval = setInterval(() => {
      if (isMountedRef.current) {
        setIsAnimating(true)
        setAnimationStep((prev) => (prev + 1) % 4)

        setTimeout(() => {
          if (isMountedRef.current) {
            setIsAnimating(false)
          }
        }, 1500)
      }
    }, 5000)

    return () => {
      isMountedRef.current = false
      clearInterval(animationInterval)
    }
  }, [])

  // تأثير عند فتح المحادثة
  useEffect(() => {
    if (isChatOpen) {
      setIsAnimating(true)
      setAnimationStep(2)

      setTimeout(() => {
        if (isMountedRef.current) {
          setIsAnimating(false)
        }
      }, 1000)
    }
  }, [isChatOpen])

  // تأثير الرسوم المتحركة للنجوم
  useEffect(() => {
    let frameId
    const particles = []
    const canvas = animationRef.current

    if (canvas && isHovered) {
      const ctx = canvas.getContext("2d")
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      // إنشاء جسيمات جديدة
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: robotColors.main,
          alpha: Math.random() * 0.5 + 0.5,
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        particles.forEach((particle, index) => {
          ctx.globalAlpha = particle.alpha
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.alpha -= 0.01

          if (particle.alpha <= 0) {
            particles.splice(index, 1)

            if (isHovered) {
              particles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: robotColors.main,
                alpha: Math.random() * 0.5 + 0.5,
              })
            }
          }
        })

        frameId = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        cancelAnimationFrame(frameId)
      }
    }
  }, [isHovered])

  // تحديث تعبير الوجه عند تغير الحالة
  useEffect(() => {
    setFacialExpression(determineFacialExpression())
  }, [isHovered, isAnimating, isChatOpen, isDragging, animationStep])

  // تحديد الأيقونة المعروضة بناءً على خطوة الرسوم المتحركة
  const renderIcon = () => {
    if (isDragging) {
      return <Move className="w-6 h-6 text-white" />
    }

    switch (animationStep) {
      case 0:
        return <Cpu className="w-6 h-6 text-white" />
      case 1:
        return <Sparkles className="w-6 h-6 text-white" />
      case 2:
        return <Lightbulb className="w-6 h-6 text-white" />
      case 3:
        return <Zap className="w-6 h-6 text-white" />
      default:
        return <Cpu className="w-6 h-6 text-white" />
    }
  }

  // تحديد تعبير الوجه بناءً على الحالة
  const determineFacialExpression = () => {
    if (isDragging) return "surprised"
    if (isChatOpen) return "happy"
    if (isAnimating) {
      switch (animationStep) {
        case 0:
          return "thinking"
        case 1:
          return "excited"
        case 2:
          return "idea"
        case 3:
          return "amazed"
        default:
          return "normal"
      }
    }
    if (isHovered) return "happy"
    return "normal"
  }

  // بدء السحب
  const handleMouseDown = (e) => {
    if (showPositionControls) {
      // حساب الإزاحة بين موضع النقر وموضع الزر
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - buttonRect.left,
        y: e.clientY - buttonRect.top,
      })
      setIsDragging(true)

      // منع السلوك الافتراضي والانتشار
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // السحب
  const handleMouseMove = (e) => {
    if (isDragging) {
      // حساب الموضع الجديد مع مراعاة الإزاحة
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // التأكد من أن الزر يبقى داخل حدود النافذة
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const buttonWidth = 75
      const buttonHeight = 75

      const boundedX = Math.max(0, Math.min(newX, windowWidth - buttonWidth))
      const boundedY = Math.max(0, Math.min(newY, windowHeight - buttonHeight))

      setPosition({ x: boundedX, y: boundedY })

      // منع السلوك الافتراضي والانتشار
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // إنهاء السحب
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)

      // حفظ الموضع في التخزين المحلي
      localStorage.setItem("assistantPosition", JSON.stringify(position))
    }
  }

  // إضافة مستمعي الأحداث للسحب
  useEffect(() => {
    if (isDragging) {
      // إضافة مستمعي الأحداث للنافذة
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleMouseUp)

      // إزالة المستمعين عند التنظيف
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // معالجة أحداث اللمس
  const handleTouchStart = (e) => {
    if (showPositionControls && e.touches && e.touches[0]) {
      const touch = e.touches[0]
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setDragOffset({
        x: touch.clientX - buttonRect.left,
        y: touch.clientY - buttonRect.top,
      })
      setIsDragging(true)

      // منع السلوك الافتراضي
      e.preventDefault()
    }
  }

  const handleTouchMove = (e) => {
    if (isDragging && e.touches && e.touches[0]) {
      const touch = e.touches[0]

      // حساب الموضع الجديد مع مراعاة الإزاحة
      const newX = touch.clientX - dragOffset.x
      const newY = touch.clientY - dragOffset.y

      // التأكد من أن الزر يبقى داخل حدود النافذة
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const buttonWidth = 75
      const buttonHeight = 75

      const boundedX = Math.max(0, Math.min(newX, windowWidth - buttonWidth))
      const boundedY = Math.max(0, Math.min(newY, windowHeight - buttonHeight))

      setPosition({ x: boundedX, y: boundedY })

      // منع السلوك الافتراضي
      e.preventDefault()
    }
  }

  // تحسين تجربة المستخدم عند النقر على زر تغيير الموضع
  const handlePositionButtonClick = (e) => {
    e.stopPropagation()
    // إضافة تأثير اهتزاز خفيف للإشارة إلى تغيير الوضع
    if (!showPositionControls) {
      if (buttonRef.current) {
        buttonRef.current.classList.add("shake-animation")
        setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.classList.remove("shake-animation")
          }
        }, 500)
      }
    }
    togglePositionMode(e)
  }

  // تبديل وضع تغيير الموضع
  const togglePositionMode = (e) => {
    e.stopPropagation()
    setShowPositionControls(!showPositionControls)

    // إضافة تأثير بصري عند تغيير الوضع
    if (buttonRef.current) {
      buttonRef.current.style.transition = "all 0.3s ease"
    }

    // إذا كنا نخرج من وضع تغيير الموضع، تأكد من حفظ الموضع الحالي
    if (showPositionControls && position.x !== null && position.y !== null) {
      localStorage.setItem("assistantPosition", JSON.stringify(position))

      // إظهار إشعار بسيط للمستخدم
      const notification = document.createElement("div")
      notification.textContent = "تم حفظ الموضع"
      notification.style.position = "fixed"
      notification.style.bottom = "20px"
      notification.style.left = "50%"
      notification.style.transform = "translateX(-50%)"
      notification.style.backgroundColor = "#1C2C4E"
      notification.style.color = "white"
      notification.style.padding = "8px 16px"
      notification.style.borderRadius = "8px"
      notification.style.zIndex = "9999"
      notification.style.opacity = "0"
      notification.style.transition = "opacity 0.3s ease"

      document.body.appendChild(notification)

      setTimeout(() => {
        notification.style.opacity = "1"
      }, 10)

      setTimeout(() => {
        notification.style.opacity = "0"
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 2000)
    }
  }

  // تحديد نمط الموضع
  const getPositionStyle = () => {
    if (position.x !== null && position.y !== null) {
      return {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: "auto",
        bottom: "auto",
      }
    }

    // الموضع الافتراضي
    return {
      position: "fixed",
      right: "24px",
      bottom: "24px",
      left: "auto",
      top: "auto",
    }
  }

  return (
    <>
      <div
        ref={buttonRef}
        style={{
          ...getPositionStyle(),
          zIndex: 40,
          cursor: showPositionControls ? "move" : "pointer",
          transition: isDragging ? "none" : "all 0.3s ease",
        }}
        className={`${isDragging ? "" : "transition-all duration-500"}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          onClick={showPositionControls ? undefined : () => setIsChatOpen(true)}
          onMouseEnter={() => !isDragging && setIsHovered(true)}
          onMouseLeave={() => !isDragging && setIsHovered(false)}
          className={`relative ${isHovered && !showPositionControls ? "scale-110" : "scale-100"} ${
            isAnimating ? "animate-float" : ""
          }`}
          style={{
            width: "90px",
            height: "100px",
            transition: isDragging ? "none" : "all 0.3s ease",
          }}
          aria-label="فتح مساعد الذكاء الاصطناعي"
        >
          {/* The robot icon container */}
          <div
            className="absolute"
            style={{
              width: "90px",
              height: "90px",
              backgroundColor: "transparent",
              borderRadius: "16px",
              overflow: "hidden",
              zIndex: 1,
              top: "0",
              left: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              transition: "all 0.3s ease",
              transform: isAnimating ? "translateY(-3px)" : isHovered ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            {/* Robot head */}
            <svg
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              <g>
                {/* Antenna */}
                <circle
                  cx="300"
                  cy="100"
                  r="60"
                  fill={robotColors.main}
                  className={isAnimating ? "animate-pulse" : ""}
                />
                <rect x="280" y="100" width="40" height="80" fill={robotColors.main} />

                {/* Head outer shape */}
                <path
                  d="M150 180 C120 180 100 200 100 230 L100 450 C100 480 120 500 150 500 L450 500 C480 500 500 480 500 450 L500 230 C500 200 480 180 450 180 L150 180 Z"
                  fill={robotColors.main}
                  stroke={robotColors.white}
                  strokeWidth="20"
                  className={isHovered ? "animate-glow-subtle" : ""}
                />

                {/* Face inner shape */}
                <rect x="150" y="230" width="300" height="220" rx="30" ry="30" fill={robotColors.main} />

                {/* Ears */}
                <circle
                  cx="100"
                  cy="320"
                  r="50"
                  fill={robotColors.main}
                  className={isChatOpen ? "animate-pulse" : ""}
                />
                <circle
                  cx="500"
                  cy="320"
                  r="50"
                  fill={robotColors.main}
                  className={isChatOpen ? "animate-pulse" : ""}
                />

                {/* Eyes - different expressions based on state */}
                {facialExpression === "happy" || facialExpression === "excited" ? (
                  // Happy/excited eyes (curved)
                  <>
                    <path
                      d={blinking ? "M190 320 Q230 310 270 320" : "M190 320 Q230 290 270 320"}
                      stroke={robotColors.white}
                      strokeWidth="15"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <path
                      d={blinking ? "M330 320 Q370 310 410 320" : "M330 320 Q370 290 410 320"}
                      stroke={robotColors.white}
                      strokeWidth="15"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </>
                ) : facialExpression === "surprised" ? (
                  // Surprised eyes (wide circles)
                  <>
                    <circle
                      cx="230"
                      cy="320"
                      r="45"
                      fill={robotColors.white}
                      stroke={robotColors.main}
                      strokeWidth="2"
                    />
                    <circle
                      cx="370"
                      cy="320"
                      r="45"
                      fill={robotColors.white}
                      stroke={robotColors.main}
                      strokeWidth="2"
                    />
                  </>
                ) : facialExpression === "thinking" ? (
                  // Thinking eyes (one normal, one squinted)
                  <>
                    <circle cx="230" cy="320" r="40" fill={robotColors.white} />
                    <path
                      d="M330 320 Q370 310 410 320"
                      stroke={robotColors.white}
                      strokeWidth="15"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </>
                ) : (
                  // Default eyes (circles)
                  <>
                    <circle
                      cx="230"
                      cy="320"
                      r="40"
                      fill={robotColors.white}
                      className={blinking ? "animate-blink" : ""}
                    />
                    <circle
                      cx="370"
                      cy="320"
                      r="40"
                      fill={robotColors.white}
                      className={blinking ? "animate-blink" : ""}
                    />
                  </>
                )}

                {/* Mouth - different expressions based on state */}
                {facialExpression === "happy" ? (
                  // Big smile
                  <path
                    d="M230 400 Q300 460 370 400"
                    stroke={robotColors.white}
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                ) : facialExpression === "excited" || facialExpression === "amazed" ? (
                  // Open mouth
                  <circle cx="300" cy="410" r="30" fill={robotColors.white} />
                ) : facialExpression === "surprised" ? (
                  // Small O mouth
                  <circle cx="300" cy="410" r="20" fill={robotColors.white} />
                ) : facialExpression === "thinking" ? (
                  // Straight line with slight curve
                  <path
                    d="M250 410 Q300 420 350 410"
                    stroke={robotColors.white}
                    strokeWidth="15"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                ) : (
                  // Default smile
                  <path
                    d="M250 400 Q300 440 350 400"
                    stroke={robotColors.white}
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                )}

                {/* Microphone/speaker */}
                <rect
                  x="270"
                  y="500"
                  width="60"
                  height="30"
                  rx="15"
                  ry="15"
                  fill={robotColors.main}
                  stroke={robotColors.white}
                  strokeWidth="10"
                  className={isChatOpen ? "animate-pulse" : ""}
                />
              </g>
            </svg>
          </div>

          {/* Canvas for animation effects */}
          <canvas ref={animationRef} width={150} height={150} className="absolute inset-0 pointer-events-none" />

          {/* Glow effect around the robot when hovered */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
              isHovered ? "opacity-70" : "opacity-0"
            }`}
            style={{
              background: "radial-gradient(circle, rgba(79, 195, 247, 0.2) 0%, rgba(79, 195, 247, 0) 70%)",
              transform: "scale(1.2)",
              filter: "blur(8px)",
            }}
          />
        </div>

        {/* أزرار التحكم في الموضع */}
        {!isDragging && (
          <button
            onClick={handlePositionButtonClick}
            className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-blue-300 dark:border-blue-700 transition-all duration-300 hover:scale-105 z-50"
            style={{
              color: showPositionControls ? "#1C2C4E" : "#64748b",
              transform: showPositionControls ? "scale(1.1)" : "scale(1)",
              boxShadow: showPositionControls
                ? "0 0 8px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
            aria-label={showPositionControls ? "إنهاء تغيير الموضع" : "تغيير موضع المساعد"}
          >
            <Move className={`w-4 h-4 ${showPositionControls ? "text-blue-600" : ""}`} />
          </button>
        )}

        {/* زر إعادة تعيين الموضع */}
        {showPositionControls && !isDragging && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              resetPosition()
            }}
            className="absolute -top-2 -left-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-blue-300 dark:border-blue-700 transition-all duration-300 hover:scale-105 z-50"
            style={{
              color: "#1C2C4E",
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)",
            }}
            aria-label="إعادة تعيين موضع المساعد"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </button>
        )}
      </div>

      {/* نص توضيحي */}
      {isHovered && !showPositionControls && !isDragging && (
        <div
          className="fixed bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-medium whitespace-nowrap transition-all duration-300 z-40"
          style={{
            ...getPositionStyle(),
            transform: "translate(85px, 20px)",
            color: robotColors.main,
            pointerEvents: "none",
            maxWidth: "200px",
            border: `1px solid rgba(75, 174, 209, 0.3)`,
          }}
        >
          <div className="font-bold mb-1">مساعد الذكاء الاصطناعي</div>
          <div className="text-xs opacity-80">اضغط للحصول على مساعدة ذكية</div>
        </div>
      )}

      {/* تعليمات تغيير الموضع */}
      {showPositionControls && !isDragging && (
        <div
          className="fixed bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-medium whitespace-nowrap transition-all duration-300 z-40"
          style={{
            ...getPositionStyle(),
            transform: "translate(85px, 20px)",
            color: robotColors.main,
            pointerEvents: "none",
            maxWidth: "200px",
            border: `1px solid rgba(75, 174, 209, 0.3)`,
          }}
        >
          <div className="font-bold mb-1">وضع تغيير الموضع</div>
          <div className="text-xs opacity-80">اسحب الأيقونة لتغيير موضعها</div>
        </div>
      )}

      <V7AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* إضافة تعريف للرسوم المتحركة */}
      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
        .animate-blink {
          animation: blink 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }

        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(75, 174, 209, 0.6); }
          50% { box-shadow: 0 0 15px rgba(75, 174, 209, 0.8); }
          100% { box-shadow: 0 0 5px rgba(75, 174, 209, 0.6); }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }

        @keyframes wave {
          0% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.7; transform: scale(1.05) rotate(5deg); }
          100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
        }
        .animate-wave {
          animation: wave 5s infinite ease-in-out;
        }

        @keyframes circuit {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-circuit {
          animation: circuit 10s infinite linear;
          background-size: 200% 200%;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }

        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(79, 195, 247, 0.6), 0 0 5px #FFFFFF inset; }
          50% { box-shadow: 0 0 20px rgba(79, 195, 247, 0.9), 0 0 8px #FFFFFF inset; }
          100% { box-shadow: 0 0 5px rgba(79, 195, 247, 0.6), 0 0 5px #FFFFFF inset; }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }

        @keyframes wave-bg {
          0% { 
            background-position: 0% 0%;
            opacity: 0.6;
          }
          50% { 
            background-position: 100% 100%;
            opacity: 0.8;
          }
          100% { 
            background-position: 0% 0%;
            opacity: 0.6;
          }
        }
        .animate-wave-bg {
          animation: wave-bg 8s infinite ease-in-out;
          background-size: 200% 200%;
        }

        @keyframes glow-subtle {
          0% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6)); }
          50% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9)); }
          100% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6)); }
        }
        .animate-glow-subtle {
          animation: glow-subtle 2s infinite ease-in-out;
        }

        @keyframes blink {
          0%, 90%, 100% { opacity: 1; transform: scaleY(1); }
          95% { opacity: 0.8; transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: center;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(59, 130, 246, 0.5); }
          50% { border-color: rgba(59, 130, 246, 1); }
        }
        .pulse-border {
          animation: pulse-border 2s infinite;
        }
      `}</style>
    </>
  )
}
