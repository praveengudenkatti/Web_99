const API_URLS = [
  /*"https://api.waifu.pics/sfw/neko",
  "https://api.waifu.pics/sfw/waifu",
  "https://api.waifu.pics/sfw/shinobu",
  "https://api.waifu.pics/sfw/megumin",*/
  "https://api.waifu.im/images/?included_tags=raiden-shogun",
  "https://api.waifu.im/images/?included_tags=marin-kitagawa",
  "https://api.waifu.im/images/?included_tags=maid",
  "https://api.waifu.im/images/?included_tags=selfies",
  "https://api.waifu.im/images",
  "https://api.waifu.im/images/?included_tags=oppai",
  "https://api.waifu.im/images/?included_tags=uniform",
  "https://api.waifu.im/images/?included_tags=waifu",
  "https://api.waifu.im/images/?included_tags=rem",
];

// ── DOM refs ──────────────────────────────────────────────
const img         = document.getElementById("waifu-image");
const skeleton    = document.getElementById("skeleton");
const pulse       = document.getElementById("pulse");
const newImgBtn   = document.getElementById("new-image-btn");
const downloadBtn = document.getElementById("download-btn");
const refreshIcon = document.getElementById("refresh-icon");
const toastEl     = document.getElementById("toast");
const starsEl     = document.getElementById("stars");

let currentImgUrl = "";

// ── Starfield ─────────────────────────────────────────────
(function buildStars() {
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("span");
    const size = Math.random() * 2.2 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%; left:${Math.random() * 100}%;
      --dur:${2.5 + Math.random() * 4}s;
      --delay:${-Math.random() * 6}s;
      --bright:${0.3 + Math.random() * 0.7};
    `;
    starsEl.appendChild(s);
  }
})();

// ── Toast ─────────────────────────────────────────────────
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2600);
}

// ── Ripple on buttons ─────────────────────────────────────
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const r = document.createElement("span");
    r.classList.add("ripple");
    const rect = btn.getBoundingClientRect();
    const sz = Math.max(rect.width, rect.height);
    r.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${e.clientX - rect.left - sz / 2}px;
      top:${e.clientY - rect.top - sz / 2}px;
    `;
    btn.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });
});

// ── Loading state ─────────────────────────────────────────
function setLoading(on) {
  skeleton.classList.toggle("hidden", !on);
  pulse.classList.toggle("hidden", !on);
  img.classList.toggle("loading", on);
}

// ── Fetch new image ───────────────────────────────────────
function getRandomApiUrl() {
  return API_URLS[Math.floor(Math.random() * API_URLS.length)];
}

async function getNewImage() {
  setLoading(true);

  // Spin the refresh icon
  refreshIcon.classList.add("spinning");
  refreshIcon.addEventListener("animationend", () => {
    refreshIcon.classList.remove("spinning");
  }, { once: true });

  const apiUrl = getRandomApiUrl();
  console.log("Fetching from:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let imgUrl;
    if (data.url) {
      imgUrl = data.url;
    } else if (data.items && data.items.length > 0) {
      imgUrl = data.items[0].url;
    }

    if (!imgUrl) throw new Error("No image URL found in response");

    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      showToast("⚠️ Failed to load image");
    };

    img.src = imgUrl;
    currentImgUrl = imgUrl;

  } catch (error) {
    console.error("Error fetching image:", error);
    setLoading(false);
    showToast("⚠️ Network error — try again");
  }
}

// ── Download ──────────────────────────────────────────────
async function downloadImage() {
  if (!currentImgUrl) {
    showToast("Nothing to steal yet!");
    return;
  }
  const link = document.createElement("a");
  link.href = currentImgUrl;
  link.download = currentImgUrl.split("/").pop();
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("✦ Stolen successfully ✦");
}

// ── Event listeners ───────────────────────────────────────
newImgBtn.addEventListener("click", getNewImage);
downloadBtn.addEventListener("click", downloadImage);

// ── Initial load ──────────────────────────────────────────
getNewImage();
