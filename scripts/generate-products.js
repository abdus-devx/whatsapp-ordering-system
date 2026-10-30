const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const productsFile = path.join(rootDir, "Assets/js/products.js");
const outputDir = path.join(rootDir, "produk");

const source = fs.readFileSync(productsFile, "utf8");
const sandbox = {};

vm.runInNewContext(
  `${source}
  globalThis.__products = products;
  globalThis.__globalFaq = globalFaq;`,
  sandbox,
);

const products = sandbox.__products;
const globalFaq = sandbox.__globalFaq;

if (!Array.isArray(products) || products.length === 0) {
  throw new Error("Data produk tidak ditemukan.");
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getImagePath(image) {
  const filename = path.posix.basename(String(image || ""));

  if (!filename || filename === "." || filename === "..") {
    throw new Error("Gambar produk tidak valid.");
  }

  return `/Assets/images/${encodeURIComponent(filename)}`;
}

const usedSlugs = new Set();

function createProductPage(product) {
  const slug = slugify(product.slug || product.name);

  if (!slug) {
    throw new Error(`Slug tidak valid untuk produk ID ${product.id}.`);
  }

  if (usedSlugs.has(slug)) {
    throw new Error(`Slug duplikat ditemukan: "${slug}".`);
  }

  usedSlugs.add(slug);

  const name = escapeHtml(product.name);
  const category = escapeHtml(product.category || "Produk Massusi");
  const description = escapeHtml(product.description || "");
  const detail = product.detail || {};
  const recommendedProducts = products
    .filter((item) => item.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  const productFaq = Array.isArray(detail.faq) ? detail.faq : [];

  const faqItems = [...productFaq, ...globalFaq]
    .filter((item) => item && item.question && item.answer)
    .slice(0, 3)
    .map((item) => ({
      question: escapeHtml(item.question),
      answer: escapeHtml(item.answer),
    }));
  const reviews = Array.isArray(detail.reviews)
    ? detail.reviews
        .filter((review) => review && review.name && review.message)
        .map((review) => ({
          name: escapeHtml(review.name),
          message: escapeHtml(review.message),
          date: escapeHtml(review.date || ""),
          rating:
            Number(review.rating) >= 1 && Number(review.rating) <= 5
              ? Math.round(Number(review.rating))
              : 0,
          image: review.image
            ? escapeHtml(
                review.image.startsWith("./")
                  ? `../../${review.image.slice(2)}`
                  : review.image,
              )
            : "",
        }))
    : [];
  const overview = escapeHtml(detail.overview || "");
  const benefits = Array.isArray(detail.benefits)
    ? detail.benefits.filter(Boolean).map(escapeHtml)
    : [];
  const highlights = Array.isArray(detail.highlights)
    ? detail.highlights.filter(Boolean).slice(0, 3).map(escapeHtml)
    : [];
  const composition = escapeHtml(detail.composition || "");
  const usage = escapeHtml(detail.usage || "");
  const packaging = escapeHtml(detail.packaging || "");
  const legality = detail.legality || {};
  const bpom = escapeHtml(legality.bpom || "");
  const halal = escapeHtml(legality.halal || "");
  const image = getImagePath(product.image);
  const price = Number(product.price);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Harga tidak valid untuk produk "${product.name}".`);
  }

  const canonical = `https://store.massusi.net/produk/${slug}/`;
  const oldPrice = Number(product.oldPrice);
  const hasOldPrice =
    Number.isFinite(oldPrice) && oldPrice > price && oldPrice > 0;

  const productJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: `https://store.massusi.net${image}`,
    category: product.category || "Produk Massusi",
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "IDR",
      price: price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }).replace(/</g, "\\u003c");

  return {
    slug,
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Toko Massusi</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">

  <meta property="og:type" content="product">
  <meta property="og:title" content="${name} | Toko Massusi">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://store.massusi.net${image}">

  <link rel="icon" type="image/png" href="/Assets/images/favicon500.png">
  <link rel="stylesheet" href="/Assets/css/style.css">
  <link rel="stylesheet" href="/Assets/css/utils.css">
  <link rel="stylesheet" href="/Assets/css/cart.css">
  <link rel="stylesheet" href="/Assets/css/product-detail.css">
  <link rel="stylesheet" href="/Assets/css/product-detail-mobile.css">

  <script type="application/ld+json">${productJsonLd}</script>
  <script src="https://unpkg.com/lucide@latest" defer></script>
  <script src="/Assets/js/script.js" defer></script>
</head>
<body>

  <header class="shop-header">
    <nav class="shop-nav">
      <a href="/" class="shop-logo">
        <span class="shop-logo-icon">
          <img src="/Assets/images/MassLogo.avif" alt="Massusi Store">
        </span>
        <span class="shop-logo-text">
          <strong>MASSUSI</strong>
          <small>STORE</small>
        </span>
      </a>

      <div class="prd-search-wrapper">
        <input
          id="prd-search-box"
          type="search"
          placeholder="Cari produk herbal..."
          onkeydown="if(event.key === 'Enter') prdSearchFunction()"
        >
      </div>

      <div class="shop-actions">
        <button
          class="shop-action"
          type="button"
          aria-label="Keranjang"
          onclick="toggleCart()"
        >
          <i data-lucide="shopping-cart"></i>
          <span id="prd-cart-count">0</span>
        </button>

        <button
          class="shop-action"
          type="button"
          aria-label="Akun"
          onclick="showAlert('Fitur akun segera hadir!')"
        >
          <i data-lucide="user-round"></i>
        </button>
      </div>
    </nav>
  </header>
  <main class="product-detail" data-product-name="${name}" data-product-price="${price}">
    <nav class="product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span>${name}</span>
    </nav>

    <section class="product-layout">
      <div class="product-gallery">
        <img
          class="product-image"
          id="product-main-image"
          src="${image}"
          alt="${name}"
          fetchpriority="high"
        >

        ${(Array.isArray(product.images) ? product.images : [product.image])
          .filter(Boolean)
          .map((galleryImage, index) => {
            const imagePath = getImagePath(galleryImage);

            return `
                <button
                  type="button"
                  class="product-thumbnail ${index === 0 ? "active" : ""}"
                  data-image="${imagePath}"
                  aria-label="Lihat foto ${index + 1} ${name}"
                  aria-pressed="${index === 0}"
                >
                <img src="${imagePath}" alt="${name} - Foto ${index + 1}" loading="lazy">
                </button>
              `;
          })
          .join("")}
      </div>

      <div class="product-detail-content">
        <span class="product-category">${category}</span>
        <h1 class="product-title">${name}</h1>

        <div class="product-price-wrap">
          <p class="product-price">${formatPrice(price)}</p>
          ${hasOldPrice ? `<p class="product-old-price">${formatPrice(oldPrice)}</p>` : ""}
        </div>

        <p class="product-description">${description}</p>

        <div class="product-purchase">
          <div class="product-quantity">
            <button
              type="button"
              class="product-quantity-btn"
              id="product-qty-minus"
              aria-label="Kurangi jumlah"
            >
              <i data-lucide="minus"></i>
            </button>

            <input
              type="number"
              id="product-qty"
              class="product-quantity-input"
              value="1"
              min="1"
              step="1"
              inputmode="numeric"
              aria-label="Jumlah produk"
            >

            <button
              type="button"
              class="product-quantity-btn"
              id="product-qty-plus"
              aria-label="Tambah jumlah"
            >
              <i data-lucide="plus"></i>
            </button>
          </div>

          <button
            type="button"
            class="product-add-to-cart"
            id="product-add-to-cart"
          >
            <i data-lucide="shopping-cart"></i>
            Tambah ke Keranjang
          </button>

          <button
            type="button"
            class="product-open-cart"
            onclick="toggleCart()"
          >
            <i data-lucide="shopping-bag"></i>
            Lihat Keranjang
            <span id="prd-cart-count">0</span>
          </button>
        </div>

        ${
          overview ||
          benefits.length ||
          composition ||
          usage ||
          packaging ||
          bpom ||
          halal
            ? `
      <div class="product-info">
        <button
        type="button"
        class="product-info-toggle"
        aria-expanded="true"
        aria-controls="product-info-content"
        >
        <span>Informasi Produk</span>
        <i data-lucide="chevron-up"></i>
        </button>

        <div class="product-info-content" id="product-info-content">

          ${
            overview
              ? overview
                  .split(/\n\s*\n/)
                  .map((paragraph) => `<p>${paragraph.trim()}</p>`)
                  .join("")
              : ""
          }

          ${
            benefits.length
              ? `
              <h3>Manfaat</h3>
              <ul>
                ${benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
              </ul>
            `
              : ""
          }

          ${composition ? `<h3>Komposisi</h3><p>${composition}</p>` : ""}
          ${usage ? `<h3>Aturan Pakai</h3><p>${usage}</p>` : ""}
          ${packaging ? `<h3>Kemasan</h3><p>${packaging}</p>` : ""}
          ${bpom ? `<p><strong>Nomor BPOM:</strong> ${bpom}</p>` : ""}
          ${halal ? `<p><strong>Informasi Halal:</strong> ${halal}</p>` : ""}
        </div>
      </div>
    `
            : ""
        }
      </div>
        </section>

    ${
      highlights.length
        ? `
      <section class="product-highlights">
        <h2>Mengapa Memilih ${escapeHtml(product.name)}?</h2>
        <div class="product-highlights-grid">
          ${highlights
            .map(
              (item) => `
            <div class="product-highlight-item">
              <i data-lucide="check-circle-2"></i>
              <span>${item}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
      `
        : ""
    }


${
  reviews.length
    ? `
  <section class="product-reviews">
    <div class="product-reviews-header">
      <div>
        <span class="product-reviews-eyebrow">CUSTOMER REVIEWS</span>
        <h2>Apa Kata Mereka?</h2>
      </div>

      <div class="product-reviews-controls">
        <button type="button" class="review-nav-btn" data-review-prev aria-label="Ulasan sebelumnya">
          <i data-lucide="arrow-left"></i>
        </button>
        <button type="button" class="review-nav-btn" data-review-next aria-label="Ulasan berikutnya">
          <i data-lucide="arrow-right"></i>
        </button>
      </div>
    </div>

    <div class="product-reviews-track" id="product-reviews-track">
      ${reviews
        .map(
          (review) => `
        <article class="product-review-item">
          ${
            review.rating
              ? `<div class="product-review-rating">
                  ${Array.from({ length: review.rating }, () => '<i data-lucide="star"></i>').join("")}
                </div>`
              : ""
          }

          <p class="product-review-message">${review.message}</p>

          ${
            review.image
              ? `<img
  class="product-review-image"
  src="${review.image}"
  alt="Foto ulasan ${review.name}"
  loading="lazy"
  data-review-image
  tabindex="0"
  role="button"
  aria-label="Perbesar foto ulasan"
/>`
              : ""
          }

          <div class="product-review-author">
            <strong>${review.name}</strong>
            ${review.date ? `<span>${review.date}</span>` : ""}
          </div>
        </article>
      `,
        )
        .join("")}
    </div>
  </section>
  `
    : ""
}

${
  faqItems.length
    ? `
  <section class="product-faq">
    <div class="product-faq-header">
      <span>PRODUCT INFORMATION</span>
      <h2>Pertanyaan yang Sering Diajukan</h2>
    </div>

    <div class="product-faq-list">
      ${faqItems
        .map(
          (item, index) => `
        <div class="product-faq-item">
          <button
            type="button"
            class="product-faq-question"
            aria-expanded="false"
            aria-controls="product-faq-answer-${index}"
          >
            <span>${item.question}</span>
            <i data-lucide="plus"></i>
          </button>

          <div
            class="product-faq-answer"
            id="product-faq-answer-${index}"
            hidden
          >
            <p>${item.answer}</p>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </section>
  `
    : ""
}

${
  recommendedProducts.length
    ? `
  <section class="product-recommendations">
    <div class="product-recommendations-header">
      <div>
        <span>YOU MAY ALSO LIKE</span>
        <h2>Produk Rekomendasi</h2>
      </div>
    </div>

    <div class="product-recommendations-grid">
      ${recommendedProducts
        .map(
          (item) => `
        <a
          href="../${slugify(item.slug || item.name)}/"
          class="recommendation-card"
        >
          <div class="recommendation-image">
            <img
              src="../../${escapeHtml(item.image.replace(/^\.\/?/, ""))}"
              alt="${escapeHtml(item.name)}"
              loading="lazy"
            />
          </div>

          <div class="recommendation-info">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.shortDescription || "")}</p>
            <strong>Rp${Number(item.price).toLocaleString("id-ID")}</strong>
          </div>
        </a>
      `,
        )
        .join("")}
    </div>
  </section>
  `
    : ""
}

  </main>

  <div id="cartDrawer" class="cart-drawer">
    <div class="drawer-header">
      <h3>Cek Pesananmu dulu!</h3>
      <button type="button" class="x-drawer" onclick="toggleCart()" aria-label="Tutup keranjang">
        <i data-lucide="x"></i>
      </button>
    </div>

    <div class="drawer-body">
      <div id="drawer-items"></div>
    </div>

    <div id="drawer-total" class="drawer-summary"></div>

    <div class="drawer-footer">
      <button type="button" class="checkout-btn" id="checkout-btn" onclick="checkout()">
        <span>Order Via WA <i data-lucide="arrow-up-right"></i></span>
      </button>
    </div>
  </div>


  <div class="review-lightbox" id="review-lightbox" aria-hidden="true">
    <button
      type="button"
      class="review-lightbox-close"
      aria-label="Tutup foto"
    >
      <i data-lucide="x"></i>
    </button>

    <img class="review-lightbox-image" src="" alt="Foto ulasan diperbesar">
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const infoToggle = document.querySelector(".product-info-toggle");
      const infoContent = document.querySelector(".product-info-content");

      if (infoToggle && infoContent) {
      infoToggle.addEventListener("click", () => {
      const isExpanded =
      infoToggle.getAttribute("aria-expanded") === "true";

      infoToggle.setAttribute("aria-expanded", String(!isExpanded));
      infoContent.hidden = isExpanded;

      const icon = infoToggle.querySelector("[data-lucide]");

        if (icon) {
          icon.setAttribute(
            "data-lucide",
            isExpanded ? "chevron-down" : "chevron-up"
          );

        if (window.lucide) {
          window.lucide.createIcons();
          }
        }
        });
      }
      

const reviewTrack = document.querySelector("#product-reviews-track");
const reviewPrev = document.querySelector("[data-review-prev]");
const reviewNext = document.querySelector("[data-review-next]");

if (reviewTrack && reviewPrev && reviewNext) {
  const updateReviewButtons = () => {
    const maxScroll = reviewTrack.scrollWidth - reviewTrack.clientWidth;

    reviewPrev.disabled = reviewTrack.scrollLeft <= 2;
    reviewNext.disabled = reviewTrack.scrollLeft >= maxScroll - 2;
  };

  const scrollReview = (direction) => {
    const review = reviewTrack.querySelector(".product-review-item");
    if (!review) return;

    const styles = window.getComputedStyle(reviewTrack);
    const gap = parseFloat(styles.columnGap) || 0;
    const distance = review.offsetWidth + gap;

    reviewTrack.scrollBy({
      left: direction * distance,
      behavior: "smooth"
    });
  };

  reviewPrev.addEventListener("click", () => scrollReview(-1));
  reviewNext.addEventListener("click", () => scrollReview(1));

  reviewTrack.addEventListener("scroll", updateReviewButtons, {
    passive: true
  });

  window.addEventListener("resize", updateReviewButtons);

  updateReviewButtons();
}

// Review Image Lightbox
const reviewLightbox = document.querySelector("#review-lightbox");
const lightboxImage = reviewLightbox?.querySelector(".review-lightbox-image");
const lightboxClose = reviewLightbox?.querySelector(".review-lightbox-close");

if (reviewLightbox && lightboxImage && lightboxClose) {
  const closeLightbox = () => {
    reviewLightbox.classList.remove("active");
    reviewLightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-review-image]").forEach((image) => {
    const openLightbox = () => {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      reviewLightbox.classList.add("active");
      reviewLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    image.addEventListener("click", openLightbox);

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  reviewLightbox.addEventListener("click", (event) => {
    if (event.target === reviewLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && reviewLightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

// Product FAQ Accordion
document.querySelectorAll(".product-faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answerId = button.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);

    button.setAttribute("aria-expanded", String(!isExpanded));

    if (answer) {
      answer.hidden = isExpanded;
    }
  });
});


      const quantityInput = document.getElementById("product-qty");
      const minusButton = document.getElementById("product-qty-minus");
      const plusButton = document.getElementById("product-qty-plus");
      const addButton = document.getElementById("product-add-to-cart");
      const productDetail = document.querySelector(".product-detail");
      const mainImage = document.getElementById("product-main-image");
      const thumbnails = document.querySelectorAll(".product-thumbnail");

      thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
      if (!mainImage) return;

      mainImage.src = thumbnail.dataset.image;

      thumbnails.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      thumbnail.classList.add("active");
      thumbnail.setAttribute("aria-pressed", "true");
      });
    });

      if (!quantityInput || !minusButton || !plusButton || !addButton || !productDetail) {
        return;
      }

      const productName = productDetail.dataset.productName;
      const productPrice = Number(productDetail.dataset.productPrice);

      const getQuantity = () => {
        const value = Number.parseInt(quantityInput.value, 10);
        return Number.isFinite(value) && value > 0 ? value : 1;
      };

      quantityInput.addEventListener("change", () => {
        quantityInput.value = getQuantity();
      });

      minusButton.addEventListener("click", () => {
        quantityInput.value = Math.max(1, getQuantity() - 1);
      });

      plusButton.addEventListener("click", () => {
        quantityInput.value = getQuantity() + 1;
      });

      addButton.addEventListener("click", () => {
        const quantity = getQuantity();

        if (typeof addToCart !== "function") {
          console.error("Fungsi keranjang belum tersedia.");
          return;
        }

        for (let i = 0; i < quantity; i++) {
          addToCart(productName, productPrice);
        }

        quantityInput.value = 1;

        if (typeof toggleCart === "function") {
          const drawer = document.getElementById("cartDrawer");
          if (drawer && !drawer.classList.contains("open")) {
            toggleCart();
          }
        }
      });
    });
  </script>
<div id="shop-toast" class="shop-toast">
  <i data-lucide="info"></i>
  <span id="shop-toast-message"></span>
</div>
</body>
</html>`,
  };
}

fs.mkdirSync(outputDir, { recursive: true });

for (const product of products) {
  const page = createProductPage(product);
  const productDir = path.join(outputDir, page.slug);

  fs.mkdirSync(productDir, { recursive: true });
  fs.writeFileSync(path.join(productDir, "index.html"), page.html, "utf8");

  console.log(`Generated: /produk/${page.slug}/`);
}

console.log(`Selesai. ${products.length} halaman produk dibuat.`);
