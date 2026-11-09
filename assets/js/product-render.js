function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

function calculateDiscount(oldPrice, price) {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function createProductSlug(product) {
  return (product.slug || product.name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createProductCard(product) {
  return `
    <div
      class="prd-card"
      data-name="${product.name}"
      data-sbc-category="${product.category}"
    >
      ${product.bestseller ? '<span class="prd-bestseller">★ BEST SELLER</span>' : ""}
    <div class="prd-image-wrapper">
      ${
        product.promo && product.oldPrice > product.price
          ? `
        <span class="prd-promo-badge">
          -${calculateDiscount(product.oldPrice, product.price)}%
        </span>
      `
          : ""
      }

  <a
    href="/produk/${createProductSlug(product)}/"
    aria-label="Lihat detail ${product.name}"
  >
    <img
      alt="${product.name}"
      class="prd-img"
      loading="lazy"
      src="${product.image}"
    />
  </a>
  </div>
       
      <div class="prd-content">
        <h3 class="prd-title">
          <a href="/produk/${createProductSlug(product)}/">
            ${product.name}
          </a>
        </h3>

        <p class="prd-desc">
            ${product.shortDescription || product.description}
        </p>

        <div class="prd-price">
        ${
          product.promo
            ? `
          <span class="prd-old-price">
          Rp ${formatPrice(product.oldPrice)}
          </span>

          <span class="prd-promo-price">
          Rp ${formatPrice(product.price)}
          </span>
          `
            : `
            Rp ${formatPrice(product.price)}
          `
        }
        </div>

        <div class="prd-btn-group">
          <div
            class="qty-control"
            data-product="${product.name}"
            data-price="${product.price}"
          ></div>
        </div>
      </div>
    </div>
  `;
}

const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;
let activeProductList = [...products];
let visibleProductCount = PRODUCTS_PER_PAGE;
let productObserver = null;
let selectedCategory = "all";
let searchKeyword = "";

function isMobileCatalog() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function filterProducts() {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const keyword = searchKeyword.toLowerCase();

    const matchesSearch =
      !keyword ||
      product.name.toLowerCase().includes(keyword) ||
      (product.shortDescription || product.description || "")
        .toLowerCase()
        .includes(keyword);

    return matchesCategory && matchesSearch;
  });

  currentPage = 1;
  visibleProductCount = PRODUCTS_PER_PAGE;

  renderProducts(filteredProducts);
  renderPagination(filteredProducts);
}

function renderProducts(productList = activeProductList) {
  const container = document.getElementById("prd-container");

  if (!container) return;

  activeProductList = [...productList];

  if (productObserver) {
    productObserver.disconnect();
    productObserver = null;
  }

  let productsToShow;

  if (isMobileCatalog()) {
    productsToShow = activeProductList.slice(0, visibleProductCount);
  } else {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    productsToShow = activeProductList.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE,
    );
  }

  container.innerHTML = productsToShow.map(createProductCard).join("");

  // Sentinel untuk mendeteksi posisi scroll mobile
  if (isMobileCatalog() && productsToShow.length < activeProductList.length) {
    const sentinel = document.createElement("div");
    sentinel.className = "prd-scroll-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    container.appendChild(sentinel);

    productObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        productObserver.disconnect();
        productObserver = null;

        visibleProductCount = Math.min(
          visibleProductCount + PRODUCTS_PER_PAGE,
          activeProductList.length,
        );

        renderProducts(activeProductList);
      },
      {
        rootMargin: "300px",
      },
    );

    productObserver.observe(sentinel);
  }

  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
}

function renderPagination(productList = activeProductList) {
  const pagination = document.getElementById("prd-pagination");

  if (!pagination) return;

  if (isMobileCatalog()) {
    pagination.innerHTML = "";
    return;
  }

  const totalPages = Math.ceil(productList.length / PRODUCTS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <button
      type="button"
      class="prd-page-btn"
      ${currentPage === 1 ? "disabled" : ""}
      onclick="changePage(${currentPage - 1})"
    >
      ‹
    </button>

    ${Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;

      return `
        <button
          type="button"
          class="prd-page-btn ${page === currentPage ? "active" : ""}"
          onclick="changePage(${page})"
        >
          ${page}
        </button>
      `;
    }).join("")}

    <button
      type="button"
      class="prd-page-btn"
      ${currentPage === totalPages ? "disabled" : ""}
      onclick="changePage(${currentPage + 1})"
    >
      ›
    </button>
  `;
}

function changePage(page) {
  currentPage = page;

  renderProducts(activeProductList);
  renderPagination(activeProductList);
}

// Reset daftar ketika ukuran layar berubah
window.addEventListener("resize", () => {
  currentPage = 1;
  visibleProductCount = PRODUCTS_PER_PAGE;

  renderProducts(activeProductList);
  renderPagination(activeProductList);
});

renderProducts(products);
renderPagination(products);
animateDiscounts();
