type ToastType = "success" | "error";

export function showToast(
  message: string,
  type: ToastType = "success"
) {
  const toast = document.createElement("div");

  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = "12px";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.color = "#fff";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  toast.style.background =
    type === "success" ? "#16A34A" : "#DC2626";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 300ms ease";
  }, 2500);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}
