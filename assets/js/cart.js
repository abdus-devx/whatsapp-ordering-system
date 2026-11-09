let cart = JSON.parse(localStorage.getItem("cart")) || [];
function getCartItem(name, variantId = null) {
  return cart.find(
    (item) =>
      item.name === name &&
      String(item.variantId || "") === String(variantId || ""),
  );
}

// FUNGSI SIMPAN DATA KERANJANG
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// FUNGSI TAMBAH KE KERANJANG
function addToCart(name, price, variant = null) {
  const variantId = variant?.id || null;
  const item = getCartItem(name, variantId);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      name,
      price: Number(price),
      qty: 1,
      variantId,
      variantOptions: variant?.options || [],
    });
  }

  saveCart();
  updateCartUI();
}
// FUNGSI KURANGI PRODUK
function decreaseQty(name, variantId = null) {
  const item = getCartItem(name, variantId);

  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    removeItem(name, variantId);
    return;
  }

  saveCart();
  updateCartUI();
}
// FUNGSI REMOVE PRODUK
function removeItem(name, variantId = null) {
  cart = cart.filter(
    (item) =>
      !(
        item.name === name &&
        String(item.variantId || "") === String(variantId || "")
      ),
  );

  saveCart();
  updateCartUI();
}

function getQty(name, variantId = null) {
  const item = getCartItem(name, variantId);
  return item ? item.qty : 0;
}

function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

// UPDATE TAMPILAN KERANJANG
function updateCartUI() {
  const countEls = document.querySelectorAll(
    "#prd-cart-count, #prd-cart-count-floating, #heroCartBadge",
  );
  const checkoutEl = document.getElementById("prd-checkout-btn");
  const itemsEl = document.getElementById("drawer-items");
  const totalEl = document.getElementById("drawer-total");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  countEls.forEach((el) => {
    el.innerText = totalQty;
  });

  if (checkoutEl) {
    checkoutEl.classList.toggle("show", cart.length > 0);
  }

  // Kontrol kuantitas pada katalog (produk tanpa varian)
  document.querySelectorAll(".qty-control").forEach((control) => {
    // Lewati kontrol yang berada di dalam drawer
    if (control.classList.contains("drawer-qty-control")) return;

    const name = control.dataset.product;
    const price = Number(control.dataset.price);
    const qty = getQty(name);

    if (qty > 0) {
      control.innerHTML = `
        <button type="button" class="prd-btn-cart"
          aria-label="Kurangi ${name}"
          onclick="decreaseQty('${name}')">
          <i data-lucide="minus"></i>
        </button>
        <span class="qty-number">${qty}</span>
        <button type="button" class="prd-btn-cart"
          aria-label="Tambah ${name}"
          onclick="addToCart('${name}', ${price})">
          <i data-lucide="plus"></i>
        </button>
      `;
    } else {
      control.innerHTML = `
        <button type="button" class="prd-btn-cart"
          aria-label="Tambah ${name} ke keranjang"
          onclick="addToCart('${name}', ${price})">
          <i data-lucide="shopping-cart"></i>
        </button>
      `;
    }
  });

  // Isi drawer keranjang
  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <i data-lucide="shopping-basket"></i>
          <p>Keranjang masih kosong.</p>
          <span>Yuk, pilih produk yang kamu inginkan.</span>
        </div>
      `;
    } else {
      itemsEl.innerHTML = cart
        .map((item) => {
          const subtotal = item.qty * item.price;
          const variantId = item.variantId ?? null;
          const variantIdArg = JSON.stringify(variantId);
          const variantLabel = item.variantOptions?.length
            ? item.variantOptions.join(" / ")
            : "";

          return `
          <div class="drawer-items">
            <div class="drawer-item-info">
              <strong class="drawer-item-name">${item.name}</strong>

              ${
                variantLabel
                  ? `<span class="drawer-item-variant">${variantLabel}</span>`
                  : ""
              }

              <span class="drawer-item-price">
                Rp ${item.price.toLocaleString("id-ID")}
              </span>

              <strong class="drawer-item-subtotal">
                Rp ${subtotal.toLocaleString("id-ID")}
              </strong>
            </div>

            <div class="drawer-item-actions">
              <div class="qty-control drawer-qty-control"
                data-product="${item.name}"
                data-price="${item.price}"
                data-variant="${variantId}">

                <button type="button" class="prd-btn-cart"
  onclick='${`decreaseQty(${JSON.stringify(item.name)}, ${JSON.stringify(variantId)})`}'>
  <i data-lucide="minus"></i>
</button>

                <span class="qty-number">${item.qty}</span>

                <button type="button" class="prd-btn-cart"
  onclick='${`addToCart(${JSON.stringify(item.name)}, ${item.price}, {
    id: ${JSON.stringify(variantId)},
    options: ${JSON.stringify(item.variantOptions || [])}
  })`}'>
  <i data-lucide="plus"></i>
</button>
              </div>

              <button type="button" class="trash-drawer"
  onclick='${`removeItem(${JSON.stringify(item.name)}, ${JSON.stringify(variantId)})`}'>
  <i data-lucide="trash-2"></i>
  <span>Hapus</span>
</button>
            </div>
          </div>
        `;
        })
        .join("");
    }
  }

  if (totalEl) {
    totalEl.innerHTML = `
      <span>Total belanja</span>
      <strong>Rp ${totalPrice.toLocaleString("id-ID")}</strong>
    `;
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function checkout() {
  let message = `Permisi Admin, tolong siapkan pesanan saya:\n`;
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.qty * item.price;
    total += subtotal;

    const variantLabel = item.variantOptions?.length
      ? item.variantOptions.join(" / ")
      : "";

    message += `
${index + 1}. ${item.name}
${variantLabel ? `Varian: ${variantLabel}\n` : ""}Jumlah: ${item.qty}
Harga: Rp ${item.price.toLocaleString("id-ID")}
Subtotal: Rp ${subtotal.toLocaleString("id-ID")}
`;
  });

  message += `
Total: Rp ${total.toLocaleString("id-ID")}`;

  const phone = "6285156312344";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

updateCartUI();
