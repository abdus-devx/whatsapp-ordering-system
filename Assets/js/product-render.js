function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

function calculateDiscount(oldPrice, price) {
  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

function createProductCard(product) {
  return `
    <div
      class="prd-card"
      data-name="${product.name}"
      data-sbc-category="${product.category}"
    >
      ${product.bestseller ? '<span class="prd-bestseller">★ BEST SELLER</span>' : ""}
      ${product.promo   
                  ? `
                      <span class="prd-promo-badge">
                        <span class="prd-promo-label">⚡ PROMO</span>
                        <div class="prd-discount-wrap>
                        <span class="prd-promo-label">HEMAT</span>
                        <span
                          class="prd-discount"
                          data-discount="${calculateDiscount(
                          product.oldPrice,
                          product.price
                          )}"
                        > 0%</span>
                        </div>
                      </span>
                    `: ""
        }

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

function renderProducts(productList) {
  const container = document.getElementById("prd-container");

  if (!container) return;

  productList = [...productList].sort(
    (a, b) => Number(b.bestseller) - Number(a.bestseller),
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const productsToShow = productList.slice(startIndex, endIndex);

  container.innerHTML = productsToShow.map(createProductCard).join("");
}

function renderPagination(productList) {
  const pagination = document.getElementById("prd-pagination");

  if (!pagination) return;

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

  renderProducts(products);
  renderPagination(products);
}

function animateDiscounts() {
  const discounts = document.querySelectorAll(
    ".prd-discount"
  );

  discounts.forEach((element) => {
    const target = Number(
      element.dataset.discount
    );

    let current = 0;

    function countUp() {
      current++;

      element.textContent = `${current}%`;

      if (current < target) {
        setTimeout(countUp, 70);
      } else {
        element.classList.add("discount-highlight");

        setTimeout(() => {
          element.classList.remove(
            "discount-highlight"
          );
        }, 500);

        setTimeout(() => {
          current = 0;
          element.textContent = "0%";
          countUp();
        }, 3500);
      }
    }

    countUp();
  });
}


renderProducts(products);
renderPagination(products);
animateDiscounts();
