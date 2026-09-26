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
  const countEl = document.getElementById("prd-cart-count");
  const checkoutEl = document.getElementById("prd-checkout-btn");

  let totalQty = 0;
  let totalPrice = 0;
  cart.forEach((item) => {
    totalQty += item.qty;
    totalPrice += item.qty * item.price;
  });

  countEl.innerText = totalQty;

  if (cart.length > 0) {
    checkoutEl.classList.add("show");
  } else {
    checkoutEl.classList.remove("show");
  }
  document.querySelectorAll(".qty-control").forEach((control) => {
    const name = control.dataset.product;

    const price = Number(control.dataset.price);

    const qty = getQty(name);

    if (qty > 0) {
      control.innerHTML = `
        <button class="prd-btn-cart"
          onclick="decreaseQty('${name}')">
          <i data-lucide="minus"></i>
        </button>

        <span class="qty-number">
          ${qty}
        </span>

        <button class="prd-btn-cart"
          onclick="addToCart('${name}', ${price})">
          <i data-lucide="plus"></i>
        </button>
      `;
    } else {
      control.innerHTML = `
        <button class="prd-btn-cart"
          onclick="addToCart('${name}', ${price})">
          <i data-lucide="shopping-cart"></i>
        </button>
      `;
    }
  });

  let itemsHtml = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.qty * item.price;

    itemsHtml += `
  <div class="drawer-items">
    <div>${item.name} x ${item.qty}</div>
    <span>Rp ${(item.qty * item.price).toLocaleString("id-ID")}</span>
    <button class="trash-drawer" onclick="removeItem('${item.name}')"><i data-lucide="trash-2"></i></button>
  </div>
  `;
  });

  document.getElementById("drawer-items").innerHTML = itemsHtml;
  document.getElementById("drawer-total").innerHTML =
    `<strong>Total: Rp ${total.toLocaleString("id-ID")}</strong>`;
  lucide.createIcons();
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
        <p>Untuk pertanyaan mengenai produk, pemesanan,
        dan pengiriman, silakan hubungi kami melalui WhatsApp.</p>
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
