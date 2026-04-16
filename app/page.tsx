
"use client"

import { useEffect, useState, useCallback } from "react"

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [loadPercent, setLoadPercent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showFeatOverlay, setShowFeatOverlay] = useState(false)
  const [featType, setFeatType] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")
  const [welcomeName, setWelcomeName] = useState("")
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: "" })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    target: "",
    package: "",
    renewalDate: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Preloader effect
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      count += 10
      setLoadPercent(count)
      if (count >= 100) clearInterval(interval)
    }, 20)

    const timeout = setTimeout(() => {
      setShowPreloader(false)
    }, 500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("moCustomerName")
    if (savedName) {
      setWelcomeName(savedName)
    }
  }, [])

  // Handle browser back button for modals
  const handlePopState = useCallback(() => {
    if (showModal) {
      setShowModal(false)
      setFormSuccess(false)
    } else if (showFeatOverlay) {
      setShowFeatOverlay(false)
      setFeatType(null)
    }
  }, [showModal, showFeatOverlay])

  useEffect(() => {
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [handlePopState])

  // Push history state when modal opens
  useEffect(() => {
    if (showModal || showFeatOverlay) {
      window.history.pushState({ modal: true }, "")
    }
  }, [showModal, showFeatOverlay])

  // Fake notifications
  useEffect(() => {
    const providers = ["010", "011", "012", "015"]
    const moPkgs = [
      "إيمرالد 20 جيجا (260 ج.م)",
      "إيمرالد 40 جيجا (420 ج.م)",
      "إيمرالد 60 جيجا (640 ج.م)",
      "فودافون RED ٣٠ جيجا (380 ج.م)",
      "فودافون RED ٦٠ جيجا (580 ج.م)",
      "WE GOLD ٢٠ جيجا (260 ج.م)",
      "WE GOLD ٥٠ جيجا (450 ج.م)",
    ]

    function generateHiddenNumber() {
      const prefix = providers[Math.floor(Math.random() * providers.length)]
      const lastThree = Math.floor(100 + Math.random() * 900)
      return prefix + "******" + lastThree
    }

    function showNotif() {
      const fakeNumber = generateHiddenNumber()
      const pkg = moPkgs[Math.floor(Math.random() * moPkgs.length)]

      setNotification({
        show: true,
        message: `تم تفعيل رقم: <b>${fakeNumber}</b><br/>باقة <b>${pkg}</b> بنجاح ✅`,
      })

      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }))
      }, 4000)
    }

    const initialTimeout = setTimeout(showNotif, 3000)
    const interval = setInterval(showNotif, 12000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  // Copy payment number
  function copyPay(text: string, name: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("تم نسخ رقم " + name + " بنجاح:\n" + text + "\n\nاستخدم الرقم الآن في تطبيقك لإتمام الدفع.")
      },
      () => {
        alert("رقم " + name + " هو: " + text)
      }
    )
  }

  // Share site
  function shareSite() {
    if (navigator.share) {
      navigator.share({
        title: "MO CONTROL - باقات الاتصالات",
        text: "لقيت لك موقع بيعمل عروض على باقات (اتصالات_فودافون_وي)تحفة والدفع بعد التفعيل! جربه من هنا:",
        url: "",
      })
    } else {
      navigator.clipboard.writeText("www.mocontrol.online").then(() => {
        alert("تم نسخ رابط الموقع بنجاح، تقدر تبعته لصحابك دلوقتي! ✅")
      })
    }
  }

  // Copy Vodafone number
  function copyVodaNum() {
    const num = "01282608730"
    navigator.clipboard.writeText(num).then(() => {
      alert("تم نسخ الرقم بنجاح ✅\n" + num)
    })
  }

  // Open modal
  function openMoFinal(packageName?: string) {
    setShowModal(true)
    if (packageName) {
      setSelectedPackage(packageName)
      setFormData((prev) => ({ ...prev, package: packageName }))
    }
  }

  // Close modal
  function closeMoFinal() {
    setShowModal(false)
    setFormSuccess(false)
  }

  // Open features
  function openFeat(type: string) {
    setFeatType(type)
    setShowFeatOverlay(true)
  }

  // Close features
  function closeFeat() {
    setShowFeatOverlay(false)
    setFeatType(null)
  }

  // Copy code
  function copyCode(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert("تم النسخ بنجاح ✅")
    })
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const botToken = "8623372347:AAGCq4fkye4GqUEzK5uaK4xv4rOlYYgfiCU"
    const chatId = "6800873609"

    const msg = `🚀 حجز جديد - MO CONTROL
━━━━━━━━━━━━━━━
👤 الاسم: ${formData.name}
📞 واتساب: ${formData.whatsapp}
📱 رقم الشحن: ${formData.target}
📦 الباقة: ${formData.package}
📅 التجديد: يوم ${formData.renewalDate}
━━━━━━━━━━━━━━━
💬 شات الواتساب:
https://wa.me/2${formData.whatsapp}`

    try {
      if (imageFile) {
        setUploadStatus("⏳ جاري رفع الوصل...")
        const fd = new FormData()
        fd.append("chat_id", chatId)
        fd.append("caption", msg)
        fd.append("photo", imageFile)
        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          body: fd,
        })
      } else {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg }),
        })
      }

      // Save name to localStorage
      localStorage.setItem("moCustomerName", formData.name)
      setWelcomeName(formData.name)

      window.open(
        `https://wa.me/201112893086?text=${encodeURIComponent(
          `أهلاً MO CONTROL، أنا ${formData.name} طلبت باقة (${formData.package}) وتجديدي يوم ${formData.renewalDate} متاح المراجعه الان☺️`
        )}`,
        "_blank"
      )

      setFormSuccess(true)
    } catch {
      alert("حدث خطأ، حاول مجدداً")
    }

    setIsSubmitting(false)
    setUploadStatus("")
  }

  // Handle logout
  function handleLogout() {
    if (confirm("هل تريد تسجيل الخروج؟")) {
      localStorage.removeItem("moCustomerName")
      setWelcomeName("")
    }
  }

  // Get short name
  function getShortName(name: string) {
    const parts = name.trim().split(/\s+/)
    return parts.slice(0, 2).join(" ")
  }

  return (
    <>
      {/* Preloader */}
      {showPreloader && (
        <div
          id="mo-elite-preloader"
          className={`fixed inset-0 z-[1000000] flex items-center justify-center transition-all duration-400 ${!showPreloader ? "opacity-0 scale-125 blur-sm pointer-events-none" : ""}`}
          style={{
            background: "#000",
            backgroundImage:
              "linear-gradient(rgba(255, 204, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 204, 0, 0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        >
          <div className="graphic-container">
            <div className="tech-circles relative">
              <div
                className="circle-outer"
                style={{
                  width: "250px",
                  height: "250px",
                  border: "2px dashed rgba(255, 204, 0, 0.2)",
                  borderRadius: "50%",
                  animation: "rotate 5s linear infinite",
                }}
              ></div>
              <div
                className="circle-inner"
                style={{
                  position: "absolute",
                  top: "25px",
                  left: "25px",
                  width: "200px",
                  height: "200px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  borderTop: "2px solid #ffcc00",
                  animation: "rotate 1s reverse linear infinite",
                }}
              ></div>
            </div>

            <div className="logo-wrapper relative text-center">
              <h1
                className="glitch-text"
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "3.2rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "8px",
                  textShadow: "0 0 20px rgba(255, 204, 0, 0.5)",
                  margin: 0,
                }}
              >
                MO CONTROL
              </h1>
              <div
                className="scan-line"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "#ffcc00",
                  boxShadow: "0 0 15px #ffcc00",
                  animation: "scan 0.8s linear infinite",
                }}
              ></div>
            </div>

            <div className="loading-data" style={{ width: "280px", marginTop: "40px" }}>
              <div
                className="data-bar"
                style={{
                  height: "4px",
                  background: "rgba(255,255,255,0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="data-progress"
                  style={{
                    height: "100%",
                    width: `${loadPercent}%`,
                    background: "#ffcc00",
                    boxShadow: "0 0 10px #ffcc00",
                    transition: "width 0.2s ease-in-out",
                  }}
                ></div>
              </div>
              <div
                className="status-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  color: "#ffcc00",
                  fontFamily: "monospace",
                  fontSize: "10px",
                }}
              >
                <span className="loading-status">SYSTEM READY</span>
                <span className="percent-val">{loadPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticker Bar */}
      <div
        className="mo-ticker-wrap"
        style={{
          width: "100%",
          overflow: "hidden",
          background: "#ffcc00",
          padding: "10px 0",
          borderBottom: "2px solid #000",
          position: "sticky",
          top: 0,
          zIndex: 999999,
          direction: "rtl",
        }}
      >
        <div
          className="mo-ticker"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "max-content",
            animation: "mo-ticker-scrolling 35s linear infinite",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mo-ticker-item"
              style={{
                display: "inline-block",
                padding: "0 40px",
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 900,
                fontSize: "15px",
                color: "#000",
              }}
            >
              ⚡ أهلاً بك في MO CONTROL | BLACK GOLD - التفعيل أولاً والدفع لاحقاً - أسرع خدمة تفعيل باقات في مصر ⚡
            </div>
          ))}
        </div>
      </div>

      {/* Hex Background */}
      <div
        className="hex-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cpath d='M50 20 L70 30 L70 50 L50 60 L30 50 L30 30 Z' fill='none' stroke='%23d4af37' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div
        className="main-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5px 15px",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <header
          className="brand-header"
          style={{
            background: "#000",
            padding: "30px 0 0 0",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Cairo', sans-serif",
            direction: "ltr",
          }}
        >
          {/* Particles */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <div
              style={{
                position: "absolute",
                width: "3px",
                height: "3px",
                background: "rgba(224, 199, 112, 0.4)",
                borderRadius: "50%",
                top: "10%",
                left: "20%",
                animation: "particle_float 6s infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "2px",
                height: "2px",
                background: "rgba(224, 199, 112, 0.3)",
                borderRadius: "50%",
                top: "40%",
                left: "70%",
                animation: "particle_float 8s infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                background: "rgba(224, 199, 112, 0.5)",
                borderRadius: "50%",
                top: "80%",
                left: "30%",
                animation: "particle_float 7s infinite",
              }}
            ></div>
          </div>

          {/* Core Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "90px",
              background: "rgba(224, 199, 112, 0.15)",
              filter: "blur(45px)",
              borderRadius: "50%",
              animation: "core_pulse 4s ease-in-out infinite",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <div style={{ display: "inline-block", position: "relative", marginBottom: "15px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "3.2rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                  filter: "drop-shadow(0 0 10px rgba(224, 199, 112, 0.2))",
                }}
              >
                MO <span style={{ color: "#e0c770" }}>CONTROL</span>
              </h1>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  animation: "sweep_animation 3.5s infinite",
                  transform: "skewX(-25deg)",
                }}
              ></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  height: "1px",
                  width: "180px",
                  background: "linear-gradient(90deg, transparent, #e0c770, transparent)",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#fff",
                  direction: "rtl",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(224, 199, 112, 0.1)",
                    padding: "5px 12px",
                    borderRadius: "10px",
                    background: "rgba(224, 199, 112, 0.03)",
                    animation: "border_glow 3s infinite",
                  }}
                >
                  <span style={{ color: "#e0c770", fontSize: "1rem" }}>⚡</span>
                  <span style={{ textShadow: "0 0 5px rgba(224, 199, 112, 0.3)" }}>تفعيل فوري</span>
                </div>
                <span style={{ color: "#fff", opacity: 0.2 }}>•</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(224, 199, 112, 0.1)",
                    padding: "5px 12px",
                    borderRadius: "10px",
                    background: "rgba(224, 199, 112, 0.03)",
                    animation: "border_glow 3s infinite",
                  }}
                >
                  <span style={{ color: "#e0c770", fontSize: "1rem" }}>🛡️</span>
                  <span style={{ textShadow: "0 0 5px rgba(224, 199, 112, 0.3)" }}>حماية فائقة</span>
                </div>
                <span style={{ color: "#fff", opacity: 0.2 }}>•</span>
                <span style={{ color: "#e0c770", textShadow: "0 0 5px rgba(224, 199, 112, 0.3)" }}>إصدار 2026</span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #e0c770, transparent)",
                  boxShadow: "0px 5px 20px rgba(224, 199, 112, 0.5)",
                  marginTop: "20px",
                  position: "relative",
                  zIndex: 20,
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Status Bar */}
        <div
          className="status-container"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0",
            direction: "rtl",
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(10px)",
              padding: "10px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
              margin: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                paddingLeft: "12px",
                marginLeft: "12px",
                direction: "ltr",
              }}
            >
              <div style={{ position: "relative", width: "8px", height: "8px" }}>
                <span
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "#7eba27",
                    borderRadius: "50%",
                    zIndex: 2,
                  }}
                ></span>
                <span
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "#7eba27",
                    borderRadius: "50%",
                    animation: "status-pulse 2s infinite",
                    opacity: 0.6,
                    zIndex: 1,
                  }}
                ></span>
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                SYSTEM LIVE
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  color: "#fff",
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                }}
              >
                التفعيل متاح وفوري الآن{" "}
                <span style={{ filter: "drop-shadow(0 0 5px #ff4500)" }}>🔥</span>
              </span>
            </div>
          </div>

          {welcomeName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(212, 175, 55, 0.1)",
                backdropFilter: "blur(10px)",
                padding: "10px 20px",
                borderRadius: "100px",
                border: "1px solid #d4af37",
                boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)",
                direction: "rtl",
                margin: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-crown" style={{ color: "#d4af37", fontSize: "0.9rem" }}></i>
                <span
                  style={{
                    color: "#fff",
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    borderLeft: "1px solid rgba(212,175,55,0.3)",
                    paddingLeft: "10px",
                    marginLeft: "5px",
                  }}
                >
                  اهلا يا {getShortName(welcomeName)} ☺️
                </span>
                <div
                  onClick={handleLogout}
                  style={{
                    cursor: "pointer",
                    color: "#ff4444",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <i className="fas fa-power-off"></i>
                  <span style={{ fontWeight: 800, fontSize: "0.7rem" }}>خروج</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginTop: "20px",
            direction: "rtl",
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {/* Stats */}
          {[
            { value: "+5000", label: "تفعيل ناجح" },
            { value: "+1200", label: "عميل دائم" },
            { value: "100%", label: "ضمان أمان" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "linear-gradient(145deg, #111, #000)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                padding: "15px 5px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  color: "#d4af37",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  textShadow: "0 0 10px rgba(212, 175, 55, 0.3)",
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#aaa", fontSize: "0.7rem", marginTop: "5px", letterSpacing: "0.5px" }}>
                {stat.label}
              </div>
            </div>
          ))}

          {/* Action buttons */}
          {[
            { icon: "M22 2L11 13M22 2L15 22L11 13L2 9L22 2", label: "اطلب التفعيل" },
            { icon: "M22 12L18 12L15 21L9 3L6 12L2 12", label: "تأكد من الخدمه" },
            {
              icon: "M2 5H22V19H2V5ZM2 10H22",
              label: "حول المبلغ",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                padding: "18px 5px",
                borderRadius: "15px",
                textAlign: "center",
                transition: "0.3s",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <svg
                  fill="none"
                  height="22"
                  stroke="#d4af37"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="22"
                >
                  <path d={item.icon}></path>
                </svg>
              </div>
              <div style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Etisalat Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "60px",
            marginBottom: "20px",
            padding: "0 5px",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "3px",
              borderRadius: "50px",
              background: "linear-gradient(90deg, #008a00, #a2d400, #fff, #a2d400, #008a00)",
              backgroundSize: "200% auto",
              animation: "glow-move 3s linear infinite",
              boxShadow: "0 0 40px rgba(0, 138, 0, 0.5)",
            }}
          >
            <div
              style={{
                background: "#000",
                padding: "12px 30px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                whiteSpace: "nowrap",
              }}
            >
              <img
                src="https://h.top4top.io/p_3751ywlpc1.jpeg"
                alt="Etisalat"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid #a2d400",
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "clamp(1.2rem, 5vw, 2.2rem)",
                  fontWeight: 900,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textShadow: "0 0 20px rgba(255,255,255,0.4)",
                }}
              >
                Etisalat <span style={{ color: "#a2d400", textShadow: "0 0 15px rgba(162, 212, 0, 0.9)" }}>Emerald</span>
              </h3>
            </div>
          </div>
        </div>

        <div
          onClick={() => openFeat("eti")}
          style={{
            cursor: "pointer",
            width: "100%",
            background: "#000",
            borderTop: "1px solid #a2d400",
            borderBottom: "1px solid #a2d400",
            padding: "12px 0",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(162, 212, 0, 0.3)",
            margin: "25px 0",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: "'Cairo'",
              fontWeight: 700,
              fontSize: "13px",
              whiteSpace: "nowrap",
              textShadow: "0 0 5px #a2d400",
            }}
          >
            اضغط هنا لمعرفة مميزات وشروط الاشتراك (اميرالد) 💡
          </span>
        </div>

        {/* Etisalat Cards */}
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            { gb: 20, oldPrice: 310, price: 260, color: "#ff3131", badge: "أقوى توفير", id: "Eti_20GB_260" },
            { gb: 25, oldPrice: 360, price: 300, color: "#a2d400", badge: "توفير إضافي", id: "Eti_25GB_300" },
            { gb: 30, oldPrice: 400, price: 340, color: "#00d2ff", badge: "الأكثر طلباً", id: "Eti_30GB_340" },
            { gb: 40, oldPrice: 500, price: 420, color: "#9b51e0", badge: "العرض المميز", id: "Eti_40GB_420" },
            { gb: 50, oldPrice: 610, price: 500, color: "#ff6600", badge: "سعر حصري", id: "Eti_50GB_500" },
            {
              gb: 60,
              oldPrice: 720,
              price: 640,
              color: "#d4af37",
              badge: "عرض الـ VIP",
              isVip: true,
              id: "Eti_60GB_640",
            },
          ].map((pkg, i) => (
            <div
              key={i}
              className="card card-discount"
              style={{
                background: "#0d0d0d",
                border: `1px solid ${pkg.color}`,
                borderRadius: "15px",
                padding: "15px",
                transition: "all 0.4s ease",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 0 15px ${pkg.color}33`,
              }}
            >
              <div
                className="sale-badge"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "-32px",
                  background: pkg.isVip
                    ? "linear-gradient(45deg, #b8860b, #f9e29d)"
                    : `linear-gradient(45deg, ${pkg.color}99, ${pkg.color})`,
                  color: pkg.isVip ? "#000" : "#fff",
                  padding: "4px 35px",
                  transform: "rotate(45deg)",
                  fontSize: "10px",
                  fontWeight: 900,
                  fontFamily: "'Cairo', sans-serif",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  zIndex: 5,
                  textAlign: "center",
                }}
              >
                {pkg.badge}
              </div>
              <h3 style={{ color: pkg.isVip ? "#f9e29d" : pkg.color, textShadow: pkg.isVip ? "0 0 10px rgba(212, 175, 55, 0.5)" : "none" }}>
                {pkg.gb} جيجا 🌐
              </h3>
              <div
                className="price"
                style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f9e29d", margin: "5px 0" }}
              >
                <span
                  className="old-price"
                  style={{
                    color: "#ff4d4d",
                    textDecoration: "line-through",
                    fontSize: "0.85em",
                    marginLeft: "8px",
                    opacity: 0.7,
                    fontWeight: "normal",
                  }}
                >
                  {pkg.oldPrice}ج
                </span>
                {pkg.price}
                <span style={{ fontSize: "0.9rem", color: "#fff" }}>ج.م</span>
              </div>
              <div
                className="details"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "12px",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  color: "#ccc",
                }}
              >
                📞 1500 دقيقة
                <div>📩 250 رسالة</div>
                🌍 10 دقائق دولي
              </div>
              <button
                onClick={() => openMoFinal(pkg.id)}
                className="btn"
                style={{
                  background: pkg.isVip ? "linear-gradient(45deg, #d4af37, #f9e29d)" : pkg.color,
                  color: pkg.isVip || pkg.color === "#a2d400" || pkg.color === "#00d2ff" ? "#000" : "#fff",
                  textDecoration: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  transition: "0.3s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                اشترك الآن
              </button>
            </div>
          ))}
        </div>

        {/* Etisalat Notice */}
        <div
          style={{
            margin: "10px auto",
            maxWidth: "400px",
            padding: "10px",
            background: "rgba(255, 204, 0, 0.05)",
            borderRight: "4px solid #ffcc00",
            direction: "rtl",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#ffcc00",
              fontFamily: "'Cairo', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            ⚠️ تنبيه: يضاف مبلغ 14 جنيه ضريبة قيمة مضافة شهرياً على جميع باقات اتصالات الموضحة أعلاه.
          </p>
        </div>

  {/* Vodafone Section */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "60px", marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              padding: "3px",
              borderRadius: "50px",
              background: "linear-gradient(90deg, #ff0000, #fff, #ff0000)",
              backgroundSize: "200% auto",
              animation: "glow-move 3s linear infinite",
              boxShadow: "0 0 30px rgba(255, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                background: "#000",
                padding: "12px 35px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <img
                src="https://h.top4top.io/p_37514ag8k1.jpg"
                alt="Vodafone"
                style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #ff0000" }}
              />
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textShadow: "0 0 15px rgba(255,255,255,0.5)",
                }}
              >
                Vodafone <span style={{ color: "#ff0000" }}>Red</span>
              </h3>
            </div>
          </div>
        </div>

        <div
          onClick={() => openFeat("voda")}
          style={{
            cursor: "pointer",
            width: "100%",
            background: "#000",
            borderTop: "1px solid #ff0000",
            borderBottom: "1px solid #ff0000",
            padding: "12px 0",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
            margin: "25px 0",
          }}
        >
          <span style={{ color: "#fff", fontFamily: "'Cairo'", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap", textShadow: "0 0 5px #ff0000" }}>
            اضغط هنا لمعرفة مميزات وشروط الاشتراك (فودافون) 📜
          </span>
        </div>

        {/* Vodafone Cards */}
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {[
            { gb: 20, price: 300, id: "Voda_20GB_300" },
            { gb: 25, price: 340, id: "Voda_25GB_340" },
            { gb: 30, price: 380, id: "Voda_30GB_380" },
            { gb: 40, price: 460, id: "Voda_40GB_460" },
            { gb: 50, price: 520, id: "Voda_50GB_520" },
            { gb: 60, price: 580, id: "Voda_60GB_580" },
          ].map((pkg, i) => (
            <div
              key={i}
              className="card"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(249, 226, 157, 0.2)",
                borderRadius: "15px",
                padding: "15px",
                transition: "all 0.4s ease",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h3 style={{ color: "#fff" }}>{pkg.gb} جيجا 🔴</h3>
              <div className="price" style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f9e29d", margin: "5px 0" }}>
                {pkg.price}<span style={{ fontSize: "0.9rem", color: "#fff" }}>ج.م</span>
              </div>
              <div
                className="details"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "12px",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  color: "#ccc",
                }}
              >
                <div>⭐ 1500 دقيقة</div>
                <div style={{ marginTop: "5px" }}>✉️ 50 رسالة نصية</div>
              </div>
              <button
                onClick={() => openMoFinal(pkg.id)}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #f9e29d, #d4af37)",
                  color: "#000",
                  textDecoration: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  transition: "0.3s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                اشترك الآن
              </button>
            </div>
          ))}
        </div>

        {/* Vodafone Notice */}
        <div
          style={{
            margin: "15px auto",
            maxWidth: "420px",
            padding: "12px",
            background: "rgba(211, 47, 47, 0.05)",
            borderRight: "4px solid #d32f2f",
            borderRadius: "0 10px 10px 0",
            direction: "rtl",
          }}
        >
          <p style={{ margin: 0, color: "#d32f2f", fontFamily: "'Cairo', sans-serif", fontSize: "13px", fontWeight: 700, lineHeight: 1.6 }}>
            🔴 <span style={{ color: "#fff" }}>ملحوظة هامة:</span> سعر باقة <span style={{ color: "#fff" }}>فودافون</span> الموضح لا يشمل الضريبة؛ يضاف مبلغ الضريبة المقررة شهرياً عند التجديد.
          </p>
        </div>

        {/* WE Section */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "60px", marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              padding: "3px",
              borderRadius: "50px",
              background: "linear-gradient(90deg, #9b51e0, #fff, #9b51e0)",
              backgroundSize: "200% auto",
              animation: "glow-move 3s linear infinite",
              boxShadow: "0 0 30px rgba(155, 81, 224, 0.4)",
            }}
          >
            <div
              style={{
                background: "#000",
                padding: "12px 35px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <img
                src="https://c.top4top.io/p_375086zx91.png"
                alt="WE"
                style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #9b51e0" }}
              />
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textShadow: "0 0 15px rgba(255,255,255,0.5)",
                }}
              >
                WE <span style={{ color: "#FFD700", textShadow: "0 0 10px #FFD700" }}>GOLD</span>
              </h3>
            </div>
          </div>
        </div>

        <div
          onClick={() => openFeat("we")}
          style={{
            cursor: "pointer",
            width: "100%",
            background: "#000",
            borderTop: "1px solid #8e44ad",
            borderBottom: "1px solid #8e44ad",
            padding: "12px 0",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(142, 68, 173, 0.3)",
            margin: "25px 0",
          }}
        >
          <span style={{ color: "#fff", fontFamily: "'Cairo'", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap", textShadow: "0 0 5px #8e44ad" }}>
            اضغط هنا لمعرفة مميزات وشروط الاشتراك (وي جولد) ✨
          </span>
        </div>

        {/* WE Cards */}
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {[
            { gb: 20, price: 260, id: "WE_20GB_260" },
            { gb: 25, price: 300, id: "WE_25GB_300" },
            { gb: 30, price: 330, id: "WE_30GB_330" },
            { gb: 40, price: 390, id: "WE_40GB_390" },
            { gb: 50, price: 450, id: "WE_50GB_450" },
            { gb: 60, price: 530, id: "WE_60GB_530" },
          ].map((pkg, i) => (
            <div
              key={i}
              className="card"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(249, 226, 157, 0.2)",
                borderRadius: "15px",
                padding: "15px",
                transition: "all 0.4s ease",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h3 style={{ color: "#fff" }}>{pkg.gb} جيجا ✨</h3>
              <div className="price" style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f9e29d", margin: "5px 0" }}>
                {pkg.price}<span style={{ fontSize: "0.9rem", color: "#fff" }}>ج.م</span>
              </div>
              <div
                className="details"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "12px",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  color: "#ccc",
                }}
              >
                ⭐ 1500 وحدة شاملة
              </div>
              <button
                onClick={() => openMoFinal(pkg.id)}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #f9e29d, #d4af37)",
                  color: "#000",
                  textDecoration: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  transition: "0.3s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                اشترك الآن
              </button>
            </div>
          ))}
        </div>

        {/* Footer Combined Section */}
        <div
          className="footer-combined-section"
          style={{
            padding: "40px 15px",
            background: "#000",
            borderTop: "2px solid rgba(212, 175, 55, 0.2)",
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              maxWidth: "1100px",
              margin: "0 auto",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {/* Share Section */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#000",
                padding: "30px",
                borderRadius: "20px",
                border: "1.5px solid #d4af37",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.1)",
              }}
            >
              <div style={{ fontSize: "1.4rem", color: "#f9e29d", marginBottom: "10px", fontWeight: 900, textShadow: "0 0 10px rgba(212, 175, 55, 0.3)" }}>
                🚀 شارك العروض مع صحابك!
              </div>
              <p style={{ color: "#bbb", fontSize: "13px", marginBottom: "25px", lineHeight: 1.6 }}>
                عجبتك باقات MO CONTROL؟ متبخلش على حبايبك وخليهم يستفيدوا بأقوى التخفيضات والدفع بعد التفعيل.
              </p>
              <button
                onClick={shareSite}
                style={{
                  background: "linear-gradient(45deg, #d4af37, #f9e29d)",
                  color: "#000",
                  border: "none",
                  padding: "14px 40px",
                  borderRadius: "50px",
                  fontWeight: 900,
                  fontFamily: "'Cairo'",
                  cursor: "pointer",
                  transition: "0.4s",
                  fontSize: "16px",
                  boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "20px" }}>🔗</span> شارك الموقع الآن
              </button>
            </div>

            {/* Payment Section */}
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                background: "#000",
                padding: "30px",
                borderRadius: "20px",
                border: "1.5px solid #d4af37",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.1)",
              }}
            >
              <div style={{ fontSize: "1.2rem", color: "#f9e29d", marginBottom: "5px", fontWeight: 800 }}>💳 طرق الدفع المعتمدة</div>
              <p style={{ color: "#888", fontSize: "11px", marginBottom: "20px" }}>اضغط على أي وسيلة لنسخ البيانات والدفع فوراً 👇</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", direction: "rtl" }}>
                <a href="https://ipn.eg/S/hamoibrahim212/instapay/8Waki0" style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                  <div
                    className="pay-chip-final"
                    style={{
                      background: "#4a148c",
                      color: "#fff",
                      padding: "10px 15px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "13px",
                      border: "1px solid #f9e29d",
                      cursor: "pointer",
                    }}
                  >
                    انستا باي 💸
                  </div>
                </a>
                <div
                  onClick={() => copyPay("01282608730", "فودافون كاش")}
                  className="pay-chip-final"
                  style={{
                    background: "#e60000",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "13px",
                    border: "1px solid #f9e29d",
                    cursor: "pointer",
                  }}
                >
                  فودافون كاش 📱
                </div>
                <div
                  onClick={() => copyPay("01282608730", "اتصالات كاش")}
                  className="pay-chip-final"
                  style={{
                    background: "#008130",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "13px",
                    border: "1px solid #f9e29d",
                    cursor: "pointer",
                  }}
                >
                  اتصالات كاش 💰
                </div>
                <div
                  onClick={() => copyPay("01282608730", "أورنج كاش")}
                  className="pay-chip-final"
                  style={{
                    background: "#ff6600",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "13px",
                    border: "1px solid #f9e29d",
                    cursor: "pointer",
                  }}
                >
                  أورنج كاش 💎
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          style={{
            display: "block",
            clear: "both",
            margin: "25px 0",
            padding: "15px 10px",
            background: "#000",
            border: "1px solid #d4af37",
            borderRadius: "20px",
            direction: "rtl",
            boxShadow: "inset 0 0 15px rgba(212, 175, 55, 0.1)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#f9e29d",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 900,
              fontSize: "1.3rem",
              marginBottom: "15px",
            }}
          >
            ⭐ تجارب عملائنا الحقيقية
          </div>

          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "12px",
              paddingBottom: "15px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {[
              { text: "بصراحة كنت خايفة في الأول بس التفعيل تم في ثواني والباقة حقيقية جداً.. شكراً ليكم ✨", name: "سارة كامل 🌸", color: "#ff69b4" },
              { text: "أحلى حاجة إنهم محترمين جداً في التعامل والنت بقى سريع وموفر معايا أوي 🎀", name: "نور الهدى", color: "#ff69b4" },
              { text: "أهم حاجة المصداقية، فعلت الأول وبعدين دفعت، شغل عالي يا وحوش ⚡", name: "إبراهيم سعد.", color: "#d4af37" },
              { text: "جربت شركات كتير بس MO CONTROL فعلاً أسرع وأرخص باقات جربتها 💗", name: "مريم محمود", color: "#ff69b4" },
              { text: "نظام التفعيل أولاً ده بجد يطمن أي حد، تسلم ايديكوا يا رجالة 👍", name: "عمر حسن", color: "#d4af37" },
            ].map((review, i) => (
              <div
                key={i}
                style={{
                  minWidth: "220px",
                  background: "#0d0d0d",
                  border: `1px solid ${review.color}70`,
                  padding: "15px",
                  borderRadius: "15px",
                  flexShrink: 0,
                }}
              >
                <div style={{ color: "#f9e29d", fontSize: "0.8rem" }}>⭐⭐⭐⭐⭐</div>
                <p style={{ color: "#fff", fontSize: "0.85rem", margin: "10px 0", fontFamily: "'Cairo', sans-serif", lineHeight: 1.6 }}>
                  {review.text}
                </p>
                <div style={{ color: review.color, fontSize: "0.75rem", fontWeight: "bold", textAlign: "left" }}>- {review.name}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", color: "#d4af37", fontSize: "0.75rem", marginTop: "5px" }}>
            👉 اسحب لمشاهدة المزيد من التجارب 👈
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div
            className="section-title"
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              margin: "10px 0 5px",
              color: "#f9e29d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: 0,
            }}
          >
            ❓ الأسئلة الشائعة
          </div>
          {[
            { q: "هل التفعيل آمن؟ 🛡️", a: "نعم، التفعيل رسمي وآمن تماماً على خطك وضمان MO CONTROL." },
            { q: "متى يتم الدفع؟ 💰", a: "يتم الدفع بعد التأكد من وصول الباقة وتجربة سرعة الإنترنت بنفسك." },
          ].map((faq, i) => (
            <div
              key={i}
              className="faq-item"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "10px",
                textAlign: "right",
              }}
            >
              <h4 style={{ color: "#f9e29d", margin: "0 0 5px", fontSize: "1rem" }}>{faq.q}</h4>
              <p style={{ color: "#ccc", fontSize: "0.85rem", margin: 0, borderRight: "2px solid #d4af37", paddingRight: "10px" }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <footer style={{ padding: "20px", color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>
          © 2026 MO CONTROL | PREMIUM SERVICES
        </footer>
      </div>

      {/* WhatsApp Float */}
      <a
        className="whatsapp-float"
        href="https://wa.me/201112893086?text=ممكن+أعرف+آخر+العروض+يا+mo control+؟+🤔+🌐+✨"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          width: "60px",
          height: "60px",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25d366",
          color: "#FFF",
          borderRadius: "50px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          transition: "all 0.3s ease",
          animation: "pulse-green 2s infinite",
        }}
      >
        <svg fill="white" height="32" viewBox="0 0 448 512" width="32">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 338.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
        </svg>
      </a>

      {/* Floating Button */}
      <div
        className="mo-floating-btn"
        onClick={() => openMoFinal()}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          background: "#ffcc00",
          color: "#000",
          padding: "12px 20px",
          borderRadius: "50px",
          cursor: "pointer",
          zIndex: 999999,
          fontFamily: "'Cairo'",
          fontWeight: 900,
          border: "2px solid #000",
          boxShadow: "0 5px 15px rgba(255,204,0,0.4)",
          animation: "moPulse 1s infinite",
        }}
      >
        <span className="btn-text">تفعيل باقة الآن 🚀</span>
      </div>

      {/* Notification */}
      <div
        className={`mo-notification ${notification.show ? "show" : ""}`}
        style={{
          position: "fixed",
          bottom: "95px",
          right: notification.show ? "20px" : "-380px",
          background: "#0a0a0a",
          borderRight: "4px solid #d4af37",
          borderRadius: "15px",
          padding: "12px 18px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 9999,
          transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          fontFamily: "'Cairo', sans-serif",
          border: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div
          className="mo-notif-icon"
          style={{
            background: "#d4af37",
            color: "#000",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          ⚡
        </div>
        <div
          className="mo-notif-text"
          style={{ color: "#fff", fontSize: "13px", direction: "rtl", lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: notification.message }}
        ></div>
      </div>

      {/* Order Modal */}
      {showModal && (
        <div
          className="mo-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeMoFinal()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000000,
            padding: "15px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="mo-form-card"
            style={{
              maxWidth: "380px",
              width: "95%",
              background: "#0c0c0c",
              border: "1px solid #ffcc00",
              padding: "15px",
              borderRadius: "20px",
              position: "relative",
              direction: "rtl",
              fontFamily: "'Cairo'",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <span
              className="close-btn"
              onClick={closeMoFinal}
              style={{
                position: "absolute",
                top: "20px",
                left: "15px",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 100,
                lineHeight: 1,
              }}
            >
              X
            </span>

            {!formSuccess ? (
              <div id="form-content-area">
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <h2 style={{ color: "#ffcc00", margin: 0, fontWeight: 900, fontSize: "35px", fontFamily: "Cairo" }}>MO CONTROL</h2>
                  <p style={{ color: "#aaa", fontSize: "10px", fontFamily: "Cairo", margin: "2px 0" }}>عالم من السرعة.. تفعيل باقاتك بالضمان 😊</p>
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", direction: "rtl" }}>
                  <div
                    onClick={copyVodaNum}
                    style={{
                      flex: 1,
                      marginBottom: 0,
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "55px",
                      borderRadius: "12px",
                      background: "#0a0a0a",
                      border: "1.5px solid #d4af37",
                      boxShadow: "0 0 10px rgba(212, 175, 55, 0.1)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: "#aaa", fontSize: "11px", fontFamily: "'Cairo'", marginBottom: "2px" }}>محفظة كاش</span>
                    <b style={{ color: "#f9e29d", fontSize: "12px", letterSpacing: "0.5px", fontFamily: "'Orbitron', sans-serif" }}>01282608730</b>
                    <span style={{ fontSize: "8px", color: "#d4af37", marginTop: "3px", fontWeight: "bold", letterSpacing: "0.5px" }}>اضغط لنسخ الرقم ✨</span>
                  </div>

                  <a href="https://ipn.eg/S/hamoibrahim212/instapay/8Waki0" style={{ flex: 1, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        minHeight: "55px",
                        padding: "6px 8px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#0a0a0a",
                        borderRadius: "12px",
                        border: "1.5px solid #d4af37",
                        boxShadow: "0 0 10px rgba(212, 175, 55, 0.1)",
                        transition: "0.3s",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="https://c.top4top.io/p_3752uliqp1.png"
                        alt="InstaPay"
                        style={{ width: "50px", height: "18px", objectFit: "contain", filter: "drop-shadow(0px 0px 5px rgba(212, 175, 55, 0.3))" }}
                      />
                      <span style={{ color: "#aaa", fontSize: "7px", fontFamily: "'Cairo'", marginTop: "2px", lineHeight: 1 }}>دفع سريع آمن</span>
                      <span style={{ fontSize: "7px", color: "#d4af37", fontWeight: "bold", letterSpacing: "0.3px", lineHeight: 1, marginTop: "2px" }}>اضغط للدفع عبر انستا باي</span>
                    </div>
                  </a>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#eee", fontSize: "11px", marginBottom: "4px" }}>الاسم بالكامل</label>
                    <input
                      type="text"
                      placeholder="اكتب اسمك"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (e.target.value.length > 2) {
                          localStorage.setItem("moCustomerName", e.target.value)
                          setWelcomeName(e.target.value)
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#111",
                        border: "1px solid #333",
                        color: "#fff",
                        borderRadius: "10px",
                        fontFamily: "'Cairo'",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#eee", fontSize: "11px", marginBottom: "4px" }}>رقم الواتساب للتواصل</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="01xxxxxxxxx"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#111",
                        border: "1px solid #333",
                        color: "#fff",
                        borderRadius: "10px",
                        fontFamily: "'Cairo'",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#ffcc00", fontSize: "11px", marginBottom: "4px" }}>الرقم المراد تفعيله</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="01xxxxxxxxx"
                      required
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value.replace(/[^0-9]/g, "") })}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#111",
                        border: "1px solid #ffcc00",
                        color: "#fff",
                        borderRadius: "10px",
                        fontFamily: "'Cairo'",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#eee", fontSize: "11px", marginBottom: "4px" }}>اختر الشبكة والباقة</label>
                    <select
                      required
                      value={formData.package || selectedPackage}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#111",
                        border: "1px solid #333",
                        color: "#fff",
                        borderRadius: "10px",
                        fontFamily: "'Cairo'",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <option disabled value="">-- اضغط لاختيار باقتك --</option>
                      <optgroup label="🟢 ETISALAT EMERALD">
                        <option value="Eti_20GB_260">EMERALD - 20GB [260 LE]</option>
                        <option value="Eti_25GB_300">EMERALD - 25GB [300 LE]</option>
                        <option value="Eti_30GB_340">EMERALD - 30GB [340 LE]</option>
                        <option value="Eti_40GB_420">EMERALD - 40GB [420 LE]</option>
                        <option value="Eti_50GB_500">EMERALD - 50GB [500 LE]</option>
                        <option value="Eti_60GB_640">EMERALD - 60GB [640 LE]</option>
                      </optgroup>
                      <optgroup label="🔴 VODAFONE RED">
                        <option value="Voda_20GB_300">VODA - 20GB [300 LE]</option>
                        <option value="Voda_25GB_340">VODA - 25GB [340 LE]</option>
                        <option value="Voda_30GB_380">VODA - 30GB [380 LE]</option>
                        <option value="Voda_40GB_460">VODA - 40GB [460 LE]</option>
                        <option value="Voda_50GB_520">VODA - 50GB [520 LE]</option>
                        <option value="Voda_60GB_580">VODA - 60GB [580 LE]</option>
                      </optgroup>
                      <optgroup label="🟣 WE GOLD">
                        <option value="WE_20GB_260">WE GOLD - 20GB [260 LE]</option>
                        <option value="WE_25GB_300">WE GOLD - 25GB [300 LE]</option>
                        <option value="WE_30GB_330">WE GOLD - 30GB [330 LE]</option>
                        <option value="WE_40GB_390">WE GOLD - 40GB [390 LE]</option>
                        <option value="WE_50GB_450">WE GOLD - 50GB [450 LE]</option>
                        <option value="WE_60GB_530">WE GOLD - 60GB [530 LE]</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#eee", fontSize: "11px", marginBottom: "4px" }}>موعد تجديد الباقة شهرياً</label>
                    <select
                      required
                      value={formData.renewalDate}
                      onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#111",
                        border: "1px solid #333",
                        color: "#fff",
                        borderRadius: "10px",
                        fontFamily: "'Cairo'",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <option disabled value="">-- اختر موعد التجديد --</option>
                      <option value="1">يوم 1 من كل شهر</option>
                      <option value="15">يوم 15 من كل شهر</option>
                    </select>
                  </div>

                  <div className="mo-input-row" style={{ marginBottom: "12px", textAlign: "right" }}>
                    <label style={{ display: "block", color: "#eee", fontSize: "11px", marginBottom: "4px" }}>إرفاق اسكرين تحويل الفلوس (اختياري)</label>
                    <div
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                      style={{
                        background: "#0d0d0d",
                        padding: "15px",
                        border: "1px dashed #d4af37",
                        borderRadius: "10px",
                        width: "100%",
                        cursor: "pointer",
                        boxSizing: "border-box",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <input
                        id="file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        style={{ display: "none" }}
                      />
                      {imageFile ? (
                        <div style={{ color: "#4CAF50", fontSize: "12px", fontFamily: "'Cairo'" }}>
                          <span style={{ fontSize: "20px", display: "block", marginBottom: "5px" }}>✅</span>
                          تم اختيار: {imageFile.name.length > 20 ? imageFile.name.substring(0, 20) + '...' : imageFile.name}
                        </div>
                      ) : (
                        <div style={{ color: "#f9e29d", fontSize: "12px", fontFamily: "'Cairo'" }}>
                          <span style={{ fontSize: "24px", display: "block", marginBottom: "5px" }}>📎</span>
                          اضغط هنا لاختيار صورة الوصل
                        </div>
                      )}
                    </div>
                    {uploadStatus && <p style={{ color: "#ffcc00", fontSize: "10px", margin: "5px 0" }}>{uploadStatus}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "15px",
                      background: "#ffcc00",
                      color: "#000",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                      fontFamily: "'Cairo'",
                      marginTop: "10px",
                    }}
                  >
                    {isSubmitting ? "جاري الحجز..." : "تأكيد الطلب"}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: "block", textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "50px", color: "#ffcc00", marginBottom: "10px" }}>✔</div>
                <h2 style={{ color: "#fff", fontSize: "18px", fontFamily: "Cairo" }}>تم استلام طلبك!</h2>
                <p style={{ color: "#aaa", fontSize: "12px", fontFamily: "Cairo" }}>سيتم توجيهك الآن للواتساب لمتابعة العملية فوراً وبشكل آلي 😊</p>
                <button
                  onClick={closeMoFinal}
                  style={{
                    background: "#ffcc00",
                    border: "none",
                    padding: "10px 25px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontFamily: "Cairo",
                    marginTop: "15px",
                  }}
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features Overlay */}
      {showFeatOverlay && (
        <div
          className="overlay-box"
          onClick={(e) => e.target === e.currentTarget && closeFeat()}
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            zIndex: 1000000,
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "#0a0a0a",
              border: "1.5px solid #d4af37",
              width: "90%",
              maxWidth: "450px",
              borderRadius: "20px",
              padding: "20px",
              position: "relative",
              boxShadow: "0 0 40px rgba(212, 175, 55, 0.2)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <span
              onClick={closeFeat}
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                color: "#d4af37",
                cursor: "pointer",
                fontSize: "22px",
                fontWeight: "bold",
                zIndex: 10,
              }}
            >
              ✕
            </span>

            {/* Etisalat Features */}
            {featType === "eti" && (
              <div>
                <h3 style={{ color: "#a2d400", textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "10px", fontFamily: "Cairo" }}>
                  Etisalat Emerald
                </h3>
                <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>💎 المميزات:</p>
                <ul style={{ listStyle: "none", padding: 0, color: "#eee", fontSize: "13px", lineHeight: 1.8, marginBottom: "20px", fontFamily: "Cairo", direction: "rtl" }}>
                  <li>✅ مكالمة خدمة العملاء مجاناً (بدون رصيد) 📱</li>
                  <li>✅ 10,000 دقيقة مجانية بين الخطوط المشتركة 🤝</li>
                  <li>✅ لو مشترك معايا بخطين او اكتر هيكلموا بعض ببلاش😉</li>
                  <li>✅ إمكانية اضافة حتي 7 خطوط يكلموا بعض ببلاش.</li>
                </ul>
                <p style={{ color: "#ffcc00", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>⚠️ شروط الاشتراك:</p>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px", fontSize: "12px", color: "#aaa", lineHeight: 1.6, fontFamily: "Cairo", direction: "rtl" }}>
                  <p>• مدة الباقة 28 يوم في حالة عدم التجديد</p>
                  <p>• الخط بيتحول لـ (فاتورة) وللرجوع لكارت تتوجه للفرع بالبطاقة</p>
                  <p>• يفضل أن يكون الخط باسمك لعدم فقدانه 🫡.</p>
                  <p style={{ color: "#fff", marginTop: "10px", borderTop: "1px solid #333", paddingTop: "10px" }}>
                    • لازم الخط يبقي علي نظام 15 قرش ولو عليه اي باقه، الغيها وحوله 15 قرش بالكود اللي تحت ده👇🏻 (اضغط عليه للنسخ)
                  </p>
                  <div
                    onClick={() => copyCode("*339#")}
                    style={{
                      background: "#111",
                      border: "1px dashed #d4af37",
                      color: "#d4af37",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginTop: "5px",
                    }}
                  >
                    *339#
                  </div>
                  <div
                    style={{
                      margin: "12px auto",
                      maxWidth: "95%",
                      background: "rgba(162, 212, 0, 0.05)",
                      border: "1px dashed #a2d400",
                      padding: "10px",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontFamily: "'Cairo', sans-serif",
                    }}
                  >
                    <p style={{ margin: 0, color: "#fff", fontSize: "13px", lineHeight: 1.6 }}>
                      <span style={{ color: "#a2d400", fontWeight: "bold" }}>⚠️ تنبيه هام:</span> يجب توافر{" "}
                      <span style={{ color: "#a2d400", fontWeight: 900 }}>5 جنيه رصيد صافي</span> وعدم وجود أي مبالغ مستحقة (سلف) لضمان إتمام عملية تحويل النظام بنجاح.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vodafone Features */}
            {featType === "voda" && (
              <div>
                <h3 style={{ color: "#ff0000", textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "10px", fontFamily: "Cairo" }}>Vodafone Red</h3>
                <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>💎 المميزات:</p>
                <ul style={{ listStyle: "none", padding: 0, color: "#eee", fontSize: "13px", lineHeight: 1.8, marginBottom: "20px", fontFamily: "Cairo", direction: "rtl" }}>
                  <li>✅ أقوى تغطية إنترنت في مصر (4G/5G).</li>
                  <li>✅ استقرار تام في جودة المكالمات والشبكة.</li>
                  <li>✅ خدمة عملاء VIP مخصصة لعملاء Red.</li>
                </ul>
                <p style={{ color: "#ffcc00", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>⚠️ شروط الاشتراك:</p>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px", fontSize: "12px", color: "#aaa", lineHeight: 1.6, fontFamily: "Cairo", direction: "rtl" }}>
                  <p>• مدة الباقة 28 يوم في حالة عدم التجديد.</p>
                  <p style={{ color: "#fff", fontWeight: "bold", background: "rgba(255,0,0,0.2)", padding: "5px", borderRadius: "5px" }}>
                    • يجب تحويل كامل المبلغ المطلوب قبل البدء 💸.
                  </p>
                  <p>• يتم التفعيل بعد إرسال لقطة شاشة (Screenshot) للتحويل.</p>
                </div>
              </div>
            )}

            {/* WE Features */}
            {featType === "we" && (
              <div>
                <h3 style={{ color: "#8e44ad", textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "10px", fontFamily: "Cairo" }}>WE GOLD</h3>
                <p style={{ color: "#d4af37", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>💎 المميزات:</p>
                <ul style={{ listStyle: "none", padding: 0, color: "#eee", fontSize: "13px", lineHeight: 1.8, marginBottom: "20px", fontFamily: "Cairo", direction: "rtl" }}>
                  <li>✅ أرخص سعر للجيجابايت وباقات توفيرية جداً.</li>
                  <li>✅ نظام وحدات مرن (دقائق وميجابايت).</li>
                  <li>✅ عروض حصرية لعملاء جولد عبر التطبيق.</li>
                </ul>
                <p style={{ color: "#ffcc00", fontWeight: "bold", fontSize: "15px", marginBottom: "8px", fontFamily: "Cairo" }}>⚠️ شروط الاشتراك:</p>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px", fontSize: "12px", color: "#aaa", lineHeight: 1.6, fontFamily: "Cairo", direction: "rtl" }}>
                  <p>• مدة الباقة 28 يوم في حالة عدم التجديد.</p>
                  <p>• متابعة الاستهلاك تتم عبر تطبيق (My WE).</p>
                </div>
              </div>
            )}

            <button
              onClick={closeFeat}
              style={{
                background: "linear-gradient(90deg, #d4af37, #f9e29d)",
                color: "#000",
                border: "none",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                marginTop: "20px",
                fontWeight: 900,
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "Cairo",
              }}
            >
              موافق
            </button>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #000;
          color: #fff;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          overflow-x: hidden;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes mo-ticker-scrolling {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }

        @keyframes particle_float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-10px); opacity: 0.6; }
        }

        @keyframes core_pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.25; }
        }

        @keyframes sweep_animation {
          0% { left: -110%; opacity: 0; }
          50% { opacity: 0.6; }
          100% { left: 110%; opacity: 0; }
        }

        @keyframes border_glow {
          0%, 100% { border-color: rgba(224, 199, 112, 0.1); box-shadow: none; }
          50% { border-color: rgba(224, 199, 112, 0.3); box-shadow: 0 0 10px rgba(224, 199, 112, 0.1); }
        }

        @keyframes status-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes glow-move {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        @keyframes moPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .card:hover {
          transform: translateY(-8px);
          border-color: #f9e29d !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.1) !important;
        }

        .whatsapp-float:hover {
          transform: scale(1.1);
          background-color: #128c7e !important;
        }

        .pay-chip-final:hover {
          border-color: #f9e29d !important;
          background: #111 !important;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.5) !important;
          transform: translateY(-3px) !important;
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </>
  )
}
