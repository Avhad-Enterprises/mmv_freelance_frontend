export default function BackToTop(value: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const result = document.querySelector(value) as HTMLElement;
  if (result) {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        result.style.display = "block";
      } else {
        result.style.display = "none";
      }
    });

    result.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
