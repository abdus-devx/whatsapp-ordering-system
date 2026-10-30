lucide.createIcons();
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// FUNGSI CARI PRODUK
function prdSearchFunction() {
  let input, filter, container, cards, title, i, txtValue;
  input = document.getElementById("prd-search-box");
  filter = input.value.toUpperCase();
  container = document.getElementById("prd-container");
  cards = container.getElementsByClassName("prd-card");

  for (i = 0; i < cards.length; i++) {
    title = cards[i].querySelector(".prd-title");
    if (
      title.innerText.toUpperCase().indexOf(filter) > -1 ||
      cards[i].dataset.name.toUpperCase().indexOf(filter) > -1
    ) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}
// FUNGSI SIMPAN DATA KERANJANG
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// FUNGSI TAMBAH KE KERANJANG
function addToCart(name, price) {
  const item = cart.find((product) => product.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1,
    });
  }
  saveCart();
  updateCartUI();
}
// FUNGSI KURANGI PRODUK
function decreaseQty(name) {
  const item = cart.find((product) => product.name === name);

  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter((product) => product.name !== name);
  }
  saveCart();
  updateCartUI();
}
// FUNGSI REMOVE PRODUK
function removeItem(name) {
  cart = cart.filter((product) => product.name !== name);

  saveCart();
  updateCartUI();
}

function getQty(name) {
  const item = cart.find((product) => product.name === name);
  return item ? item.qty : 0;
}

function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

// UPDATE TAMPILAN KERANJANG
function updateCartUI() {
  const countEls = document.querySelectorAll(
    "#prd-cart-count, #prd-cart-count-floating",
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

  document.querySelectorAll(".qty-control").forEach((control) => {
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

          return `
          <div class="drawer-items">
            <div class="drawer-item-info">
              <strong class="drawer-item-name">${item.name}</strong>
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
                data-price="${item.price}">
                <button type="button" class="prd-btn-cart"
                  aria-label="Kurangi ${item.name}"
                  onclick="decreaseQty('${item.name}')">
                  <i data-lucide="minus"></i>
                </button>
                <span class="qty-number">${item.qty}</span>
                <button type="button" class="prd-btn-cart"
                  aria-label="Tambah ${item.name}"
                  onclick="addToCart('${item.name}', ${item.price})">
                  <i data-lucide="plus"></i>
                </button>
              </div>

              <button type="button" class="trash-drawer"
                aria-label="Hapus ${item.name}"
                onclick="removeItem('${item.name}')">
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

updateCartUI();

function checkout() {
  let message = `Permisi Admin, tolong siapkan pesanan saya:
  `;
  let total = 0;

  cart.forEach((item) => {
    total += item.qty * item.price;
    message += `
    ${item.name} x ${item.qty}
    Rp ${(item.qty * item.price).toLocaleString("id-ID")}
    `;
  });
  message += `
    Total: Rp ${total.toLocaleString("id-ID")}`;

  const phone = "6285156312344";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

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
