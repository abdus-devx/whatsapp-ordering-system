const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const productsFile = path.join(rootDir, "Assets/js/products.js");
const outputDir = path.join(rootDir, "produk");

const source = fs.readFileSync(productsFile, "utf8");
const sandbox = {};

vm.runInNewContext(`${source}\nglobalThis.__products = products;`, sandbox);

const products = sandbox.__products;

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

  <script type="application/ld+json">${productJsonLd}</script>
  <script src="https://unpkg.com/lucide@latest" defer></script>
  <script src="/Assets/js/script.js" defer></script>
</head>
<body>
  <main class="product-detail" data-product-name="${name}" data-product-price="${price}">
    <nav class="product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Beranda</a>
      <span aria-hidden="true">/</span>
      <span>${name}</span>
    </nav>

    <section class="product-layout">
      <div class="product-gallery">
        <img
          class="product-image"
          src="${image}"
          alt="${name}"
          fetchpriority="high"
        >
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

        <div class="product-info">
          <h2>Informasi Produk</h2>
          <p>Silakan periksa label kemasan untuk informasi komposisi, aturan pakai, dan penyimpanan produk.</p>
        </div>
      </div>
    </section>
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

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const quantityInput = document.getElementById("product-qty");
      const minusButton = document.getElementById("product-qty-minus");
      const plusButton = document.getElementById("product-qty-plus");
      const addButton = document.getElementById("product-add-to-cart");
      const productDetail = document.querySelector(".product-detail");

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
