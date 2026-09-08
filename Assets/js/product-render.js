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

function renderProducts(productList) {
  const container = document.getElementById("prd-container");

  if (!container) return;

  container.innerHTML = productList
    .map(createProductCard)
    .join("");
}

renderProducts(products);