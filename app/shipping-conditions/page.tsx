export default function ShippingConditionsPage() {
  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>تقسيم الشحنات لفئات</h1>
        <button
          style={{
            backgroundColor: "#1a3a6c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          إنشاء خاصية أتمتة جديدة
        </button>
      </div>

      {/* Conditions Section */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "white",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "red", fontWeight: "bold" }}>*</span>
          <span style={{ color: "#1a3a6c", fontWeight: "bold" }}>إذا</span>
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", position: "relative" }}>
              <button
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "red",
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#666" }}>▼</span>
                  <span style={{ color: "#333" }}>إختر خصائص الشحنة</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#666" }}>▼</span>
                  <span style={{ color: "#333" }}>يساوي</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      borderRight: "none",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#666" }}>SAR</span>
                  </div>
                  <input
                    type="text"
                    placeholder="السعر"
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #e5e7eb",
                      borderLeft: "none",
                      borderTopLeftRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      textAlign: "right",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "8px",
              border: "1px dashed #93c5fd",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <span style={{ marginLeft: "8px" }}>+</span>
            إضافة شرط
          </button>
        </div>
      </div>

      {/* Actions Section */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "white",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "red", fontWeight: "bold" }}>*</span>
          <span style={{ color: "#1a3a6c", fontWeight: "bold" }}>قم</span>
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", position: "relative" }}>
              <button
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "red",
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#666" }}>▼</span>
                  <span style={{ color: "#333" }}>لا تستخدم شركة الشحن</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#666" }}>▼</span>
                  <span style={{ color: "#333" }}>أرامكس</span>
                </div>
              </div>
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "8px",
              border: "1px dashed #93c5fd",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <span style={{ marginLeft: "8px" }}>+</span>
            إضافة إجراء
          </button>
        </div>
      </div>

      {/* Support Message */}
      <div style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
        لم تتمكن من إيجاد ماتبحث عنه ، يرجى التواصل معنا
      </div>

      {/* Shipping Property Name */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ color: "#1a3a6c", fontWeight: "bold" }}>خاصية الشحن</span>
          <span style={{ color: "red", fontWeight: "bold", marginRight: "4px" }}>*</span>
        </div>
        <input
          type="text"
          placeholder="يرجى تسمية خاصية الشحن مثلا (الشحنات الأكبر من 10 كيلو)"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>

      {/* Shipping Property Description */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ color: "#1a3a6c", fontWeight: "bold" }}>وصف خاصية الشحن</span>
        </div>
        <textarea
          placeholder="أضف وصف للخاصية ليسهل العودة لها مستقبلاً (اختياري)"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            minHeight: "100px",
            outline: "none",
          }}
        ></textarea>
      </div>

      {/* Bottom Line */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
        <div
          style={{
            height: "4px",
            backgroundColor: "#333",
            width: "33%",
            borderRadius: "9999px",
          }}
        ></div>
      </div>
    </div>
  )
}
