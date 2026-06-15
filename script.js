
lucide.createIcons();
let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // FUNGSI CARI PRODUK
  function prdSearchFunction() {
    let input, filter, container, cards, title, i, txtValue;
    input = document.getElementById('prd-search-box');
    filter = input.value.toUpperCase();
    container = document.getElementById('prd-container');
    cards = container.getElementsByClassName('prd-card');
  
    for (i = 0; i < cards.length; i++) {
      title = cards[i].querySelector(".prd-title");
      if (title.innerText.toUpperCase().indexOf(filter) > -1 || cards[i].dataset.name.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
  // FUNGSI SIMPAN DATA KERANJANG
  function saveCart() {
       localStorage.setItem('cart', JSON.stringify(cart)); 
  }
    
  // FUNGSI TAMBAH KE KERANJANG
  function addToCart(name, price) {
    const item = cart.find(product => product.name === name)
    
    if(item) {
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
       const item = cart.find(product => product.name === name);
    
        if (!item) return;
    
        item.qty--;
    
        if (item.qty <= 0) {
            cart = cart.filter(product => product.name !== name);
      }
    saveCart();
    updateCartUI();
    
  }
  // FUNGSI REMOVE PRODUK
  function removeItem (name) {
        cart = cart.filter(product => product.name !== name);
    
    saveCart();
    updateCartUI();
  }
    
  function getQty(name) {
    const item = cart.find(product => product.name === name);
    return item ? item.qty : 0;
  } 
  
  function toggleCart(){
    document
    .getElementById('cartDrawer')
    .classList.toggle('open');
  }



  // UPDATE TAMPILAN KERANJANG
  function updateCartUI() {
    const countEl = document.getElementById('prd-cart-count');
    const checkoutEl = document.getElementById('prd-checkout-btn');
    
    let totalQty = 0;
    let totalPrice = 0; 
    cart.forEach( item => {
      totalQty += item.qty;
      totalPrice += item.qty * item.price;
    });
    
    countEl.innerText = totalQty;
    
    if(cart.length > 0) {
      checkoutEl.classList.add('show');
     
    } else {
      checkoutEl.classList.remove('show');
    }
  document
  .querySelectorAll('.qty-control')
  .forEach(control => {

    const name =
      control.dataset.product;

    const price =
      Number(control.dataset.price);

    const qty =
      getQty(name);

    if(qty > 0){

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

let itemsHtml = '';
let total = 0;

cart.forEach(item => {
  total += item.qty * item.price;
  
  itemsHtml += `
  <div class="drawer-items">
    <span>${item.name} x ${item.qty} = Rp ${item.qty * item.price}</span>
    <button onclick="removeItem('${item.name}')"><i data-lucide="x"></i></button>
  </div>
  `;
});

document.getElementById('drawer-items').innerHTML = itemsHtml;
document.getElementById('drawer-total').innerHTML = `<strong>Total: Rp ${total}</strong>`;
lucide.createIcons();
  } 

updateCartUI();