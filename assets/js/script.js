lucide.createIcons();

// FUNGSI CARI PRODUK
function prdSearchFunction() {
  const input = document.getElementById("prd-search-box");

  if (!input) return;

  const keyword = input.value.trim();

  const container = document.getElementById("prd-container");

  if (!container) {
    window.location.href = `/?search=${encodeURIComponent(keyword)}`;
    return;
  }

  searchKeyword = keyword;
  filterProducts();
}

// BACA PARAMETER SEARCH DARI URL
function initProductSearch() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");

  if (keyword === null) return;

  const input = document.getElementById("prd-search-box");

  if (!input) return;

  input.value = keyword;
  searchKeyword = keyword;
  filterProducts();
}

initProductSearch();
updateCartUI();

// POPUP PAGE

document.addEventListener("DOMContentLoaded", () => {
  const infoLinks = document.querySelectorAll(".sft-info-link");
  const modal = document.getElementById("sft-info-modal");
  const closeButton = document.getElementById("sft-modal-close");
  if (!modal || !closeButton) return;

  const infoData = {
    tentang: {
      title: "Tentang Kami",
      content: `
        <p>Massusi Store menyediakan produk herbal pilihan
        untuk membantu menunjang kesehatan dan kebugaran keluarga.</p>
      `,
    },

    pemesanan: {
      title: "Cara Pemesanan",
      content: `
        <p>Pilih produk yang ingin dipesan, masukkan jumlahnya,
        lalu lanjutkan pesanan melalui WhatsApp.</p>
      `,
    },

    pengiriman: {
      title: "Pengiriman",
      content: `
        <p>Pesanan akan diproses setelah konfirmasi melalui WhatsApp
        dan dikirim ke alamat yang diberikan.</p>
      `,
    },

    faq: {
      title: "FAQ",
      content: `
    <div class="sft-faq-item">
      <strong>Bagaimana cara memesan?</strong>
      <p>
        Pilih produk yang ingin dipesan, tentukan jumlahnya,
        lalu lanjutkan pesanan melalui WhatsApp.
      </p>
    </div>

    <div class="sft-faq-item">
      <strong>Apakah bisa memesan melalui WhatsApp?</strong>
      <p>
        Ya. Pesanan dapat dikonfirmasi dan diproses melalui WhatsApp.
      </p>
    </div>

    <div class="sft-faq-item">
      <strong>Bagaimana proses pengirimannya?</strong>
      <p>
        Pesanan diproses setelah konfirmasi dan kemudian
        dikirim ke alamat yang diberikan.
      </p>
    </div>
  `,
    },
  };

  infoLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const infoType = link.dataset.info;
      const info = infoData[infoType];

      document.getElementById("sft-modal-title").textContent = info.title;

      document.getElementById("sft-modal-content").innerHTML = info.content;

      modal.classList.add("active");
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  const overlay = modal.querySelector(".sft-modal-overlay");

  overlay.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.classList.remove("active");
    }
  });
});

// TOAST NOTIFICATION
let toastTimer;

function showAlert(message) {
  const toast = document.getElementById("shop-toast");
  const toastMessage = document.getElementById("shop-toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function initCategoryScrollIndicator() {
  const list = document.querySelector(".sbc-list");
  const indicator = document.querySelector(".sbc-scroll-indicator");
  const thumb = document.querySelector(".sbc-scroll-thumb");

  if (!list || !indicator || !thumb) return;

  function updateIndicator() {
    const maxScroll = list.scrollWidth - list.clientWidth;
    const trackWidth = indicator.clientWidth;

    if (maxScroll <= 1) {
      indicator.style.display = "none";
      return;
    }

    indicator.style.display = "block";

    const thumbWidth = (list.clientWidth / list.scrollWidth) * trackWidth;
    const maxThumbMove = trackWidth - thumbWidth;
    const scrollProgress = list.scrollLeft / maxScroll;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${scrollProgress * maxThumbMove}px)`;
  }

  list.addEventListener("scroll", updateIndicator, { passive: true });
  window.addEventListener("resize", updateIndicator);

  updateIndicator();
}

document.addEventListener("DOMContentLoaded", initCategoryScrollIndicator);

/* ================================
   DETAIL HEADER SCROLL
=========== */

function initDetailHeader() {
  const header = document.getElementById("detailHeader");

  if (!header) return;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });
}

document.addEventListener("DOMContentLoaded", initDetailHeader);

/* ================================
   HOME ANTI RELOAD
=========== */

document.addEventListener("DOMContentLoaded", () => {
  const homeLink = document.querySelector('.mobile-bottom-nav a[href="/"]');

  if (homeLink && window.location.pathname === "/") {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
