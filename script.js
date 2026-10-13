const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const backToTop = document.querySelector(".back-to-top");

document.querySelector("#current-year").textContent = new Date().getFullYear();

const updateBackToTopVisibility = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  backToTop.classList.toggle("is-visible", scrollableHeight > 0 && window.scrollY >= scrollableHeight / 3);
};

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
window.addEventListener("resize", updateBackToTopVisibility);
updateBackToTopVisibility();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "메뉴 열기" : "메뉴 닫기");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
    primaryNav.classList.remove("is-open");
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const accessKey = String(formData.get("access_key")).trim();

  if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    formStatus.textContent = "전송 설정이 아직 완료되지 않았습니다. Web3Forms 액세스 키를 설정해 주세요.";
    formStatus.className = "form-status is-error";
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  formStatus.textContent = "메시지를 보내고 있습니다...";
  formStatus.className = "form-status";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "메시지 전송에 실패했습니다.");
    }

    contactForm.reset();
    formStatus.textContent = "메시지를 보냈습니다. 연락 주셔서 감사합니다!";
    formStatus.className = "form-status is-success";
  } catch (error) {
    formStatus.textContent = error instanceof Error ? error.message : "전송 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.";
    formStatus.className = "form-status is-error";
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
});