function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

function createProductCard(product) {
  return `
    <div
      class="prd-card"
      data-name="${product.name}"
      data-sbc-category="${product.category}"
    >
      <img
        alt="${product.name}"
        class="prd-img"
        loading="lazy"
        src="${product.image}"
      />

      <div class="prd-content">
        <h3 class="prd-title">${product.name}</h3>

        <p class="prd-desc">
          ${product.description}
        </p>

        <div class="prd-price">
          Rp ${formatPrice(product.price)}
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

function renderProducts(productList) {
  const container = document.getElementById("prd-container");

  if (!container) return;

  productList = [...productList].sort(
  (a, b) => Number(b.bestseller) - Number(a.bestseller)
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const productsToShow = productList.slice(startIndex, endIndex);

  container.innerHTML = productsToShow
    .map(createProductCard)
    .join("");
}



function renderPagination(productList) {
  const pagination = document.getElementById("prd-pagination");

  if (!pagination) return;

  const totalPages = Math.ceil(
    productList.length / PRODUCTS_PER_PAGE
  );

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
          class="prd-page-btn ${
            page === currentPage ? "active" : ""
          }"
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

  renderProducts(products);
  renderPagination(products);
}

renderProducts(products);
renderPagination(products);