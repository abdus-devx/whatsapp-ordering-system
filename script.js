
lucide.createIcons();
let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalPrice = 0;
  
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
  // FUSNGSI SIMPAN DATA KERANJANG
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
    
  // UPDATE TAMPILAN KERANJANG
  function updateCartUI() {
    const countEl = document.getElementById('prd-cart-count');
    const checkoutEl = document.getElementById('prd-checkout-btn');
    
    let totalQty = 0;
    cart.forEach( item => {
      totalQty += item.qty;
    });
    
    countEl.innerText = totalQty;
    
    if(cart.length > 0) {
      checkoutEl.classList.add('show');
      // Buat link WA
      let message = "Halo Massusi, saya mau order:%0A";
      cart.forEach((item, index) => {
        message += `${index+1}. ${item.name} - Rp ${item.price.toLocaleString('id-ID')}%0A`;
      });
      message += `%0A*Total: Rp ${totalPrice.toLocaleString('id-ID')}*`;
      
      // Nomor WA kamu: 085156312344
      checkoutEl.href = `https://wa.me/6285156312344?text=${message}`;
    } else {
      checkoutEl.classList.remove('show');
    }
  }
    
  updateCartUI();
