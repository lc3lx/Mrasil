"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { V7AIChat } from "./v7-ai-chat"
import { Sparkles, Lightbulb, Move, RotateCcw, Cpu, Zap } from "lucide-react"
import Image from "next/image"
import Ai from "../../public/Ai.png"
import { motion, AnimatePresence } from "framer-motion";
import { MarasilAtomLogo } from "@/app/invoices/components/MarasilAtomLogo"
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
      notification.style.top = "0"
      notification.style.left = "50%"
      notification.style.transform = "translateX(-50%)"
      notification.style.backgroundColor = "#1C2C4E"
      notification.style.color = "white"
      notification.style.padding = "8px 16px"
      notification.style.borderRadius = "8px"
      notification.style.zIndex = "999"
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
      right: "auto",
      top: "0",
      left:"0",
      zIndex:"0",
      bottom:"0"
    }
  }

  return (
    <div className=" ">
      <div
      
        ref={buttonRef}
          className={`relative w-[40px] mx-auto    h-[40px] v7-neu-button-sm-boot  text-gry hover:text-[#3498db] ${showPositionControls ? "cursor-move" : "cursor-pointer"} `}

        // className={`${isDragging ? "" : "transition-all duration-500"}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        
      >
        <div
          onClick={showPositionControls ? undefined : () => setIsChatOpen(true)}
          onMouseEnter={() => !isDragging && setIsHovered(true)}
          onMouseLeave={() => !isDragging && setIsHovered(false)}
          // className={`relative ${isHovered && !showPositionControls ? "scale-110" : "scale-100"} ${
          //   isAnimating ? "animate-float" : ""
          // }`}
          className="  "
          style={{
            width: "60px",
            height: "60px",
            transition: isDragging ? "none" : "all 0.3s ease",
          }}
          aria-label="فتح مساعد الذكاء الاصطناعي"
        >
          {/* The robot icon container */}
          <div
            className="absolute "
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "none",
              overflow: "hidden",
              zIndex: 0,
              top: "0",
              left: "0",
              position: "relative",

            }}
          >
            {/* Robot head */}
             {/* 3D Atom Logo container with improved dimensions */}
        <motion.div
          className="relative  w-full  mx-auto  bg-transparent "
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Updated 3D Rotating Atom Logo with individually rotating rings */}
          <div className="flex justify-center ">
            <MarasilAtomLogo
              size={40}
              animated={true}
              className=" w-full h-auto"
            />
          </div>

          {/* Enhanced glow effect around the 3D atom */}
          <div className="absolute inset-0 -m-6 rounded-full pointer-events-none">
            <motion.div
              className="absolute inset-0 rounded-full border border-[#3B82F6]/20"
            />
          </div>
        </motion.div>
              {/* <Image alt="ai" src={Ai} className=" bg-none" /> */}
          </div>

          {/* Canvas for animation effects */}
          <canvas ref={animationRef} width={150} height={150} className="absolute inset-0 pointer-events-none" />

          {/* Glow effect around the robot when hovered */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-300  ${ isHovered ? "opacity-70" : "opacity-0"}
              `
          }
            style={{
              background: "radial-gradient(circle, rgba(79, 195, 247, 0.2) 0%, rgba(79, 195, 247, 0) 70%)",
              transform: "scale(1.2)",
              filter: "blur(8px)",
            }}
          />
        </div>
      </div>

      {/* نص توضيحي */}
      {isHovered && !showPositionControls && !isDragging && (
        <div
          className="fixe  -me-10 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md text-sm font-medium whitespace-nowrap transition-all duration-300 z-40"
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
     

      <V7AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* إضافة تعريف للرسوم المتحركة */}
     
    </div>
  )
}
