document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // PRODUCT INFO ACCORDION
  // =========================================================

  const infoToggle = document.querySelector(".product-info-toggle");
  const infoContent = document.querySelector(".product-info-content");
  const infoPreview = document.querySelector(".product-info-preview");

  if (infoToggle && infoContent) {
    if (infoPreview) {
      infoPreview.style.cursor = "pointer";

      infoPreview.addEventListener("click", () => {
        infoToggle.click();
      });
    }

    infoToggle.addEventListener("click", () => {
      const isExpanded = infoToggle.getAttribute("aria-expanded") === "true";

      infoToggle.setAttribute("aria-expanded", String(!isExpanded));
      infoContent.hidden = isExpanded;

      if (infoPreview) {
        infoPreview.hidden = !isExpanded;
      }

      const icon = infoToggle.querySelector("[data-lucide]");

      if (icon) {
        icon.setAttribute(
          "data-lucide",
          isExpanded ? "chevron-down" : "chevron-up",
        );

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  }

  // =========================================================
  // DETAIL SEARCH
  // =========================================================

  const detailSearchForm = document.getElementById("detail-search-form");
  const detailSearchInput = document.getElementById("detail-search-input");

  if (detailSearchForm && detailSearchInput) {
    detailSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const keyword = detailSearchInput.value.trim();

      if (!keyword) return;

      window.location.href = "/?search=" + encodeURIComponent(keyword);
    });
  }

  // =========================================================
  // PRODUCT REVIEWS CAROUSEL
  // =========================================================

  const reviewTrack = document.querySelector("#product-reviews-track");
  const reviewPrev = document.querySelector("[data-review-prev]");
  const reviewNext = document.querySelector("[data-review-next]");

  if (reviewTrack && reviewPrev && reviewNext) {
    const updateReviewButtons = () => {
      const maxScroll = reviewTrack.scrollWidth - reviewTrack.clientWidth;

      reviewPrev.disabled = reviewTrack.scrollLeft <= 2;
      reviewNext.disabled = reviewTrack.scrollLeft >= maxScroll - 2;
    };

    const scrollReview = (direction) => {
      const review = reviewTrack.querySelector(".product-review-item");

      if (!review) return;

      const styles = window.getComputedStyle(reviewTrack);
      const gap = parseFloat(styles.columnGap) || 0;
      const distance = review.offsetWidth + gap;

      reviewTrack.scrollBy({
        left: direction * distance,
        behavior: "smooth",
      });
    };

    reviewPrev.addEventListener("click", () => scrollReview(-1));
    reviewNext.addEventListener("click", () => scrollReview(1));

    reviewTrack.addEventListener("scroll", updateReviewButtons, {
      passive: true,
    });

    window.addEventListener("resize", updateReviewButtons);

    updateReviewButtons();
  }

  // =========================================================
  // MORE MENU
  // =========================================================

  const moreButton = document.getElementById("detail-more-btn");
  const moreMenu = document.getElementById("detail-more-menu");
  const copyLinkButton = document.getElementById("detail-copy-link");

  if (moreButton && moreMenu) {
    moreButton.addEventListener("click", () => {
      const isOpen = !moreMenu.hidden;

      moreMenu.hidden = isOpen;
      moreButton.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (event) => {
      if (
        !moreButton.contains(event.target) &&
        !moreMenu.contains(event.target)
      ) {
        moreMenu.hidden = true;
        moreButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================================================
  // COPY PRODUCT LINK
  // =========================================================

  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);

        if (typeof showAlert === "function") {
          showAlert("Link produk berhasil disalin!");
        }

        if (moreMenu) moreMenu.hidden = true;

        if (moreButton) {
          moreButton.setAttribute("aria-expanded", "false");
        }
      } catch (error) {
        console.error("Gagal menyalin link:", error);

        if (typeof showAlert === "function") {
          showAlert("Tidak dapat menyalin link produk.");
        }
      }
    });
  }

  // =========================================================
  // REVIEW IMAGE LIGHTBOX
  // =========================================================

  const reviewLightbox = document.querySelector("#review-lightbox");
  const lightboxImage = reviewLightbox?.querySelector(".review-lightbox-image");
  const lightboxClose = reviewLightbox?.querySelector(".review-lightbox-close");

  if (reviewLightbox && lightboxImage && lightboxClose) {
    const closeLightbox = () => {
      reviewLightbox.classList.remove("active");
      reviewLightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-review-image]").forEach((image) => {
      const openLightbox = () => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        reviewLightbox.classList.add("active");
        reviewLightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
      };

      image.addEventListener("click", openLightbox);

      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    reviewLightbox.addEventListener("click", (event) => {
      if (event.target === reviewLightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        reviewLightbox.classList.contains("active")
      ) {
        closeLightbox();
      }
    });
  }

  // =========================================================
  // PRODUCT FAQ ACCORDION
  // =========================================================

  document.querySelectorAll(".product-faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);

      button.setAttribute("aria-expanded", String(!isExpanded));

      if (answer) {
        answer.hidden = isExpanded;
      }
    });
  });

  // =========================================================
  // PRODUCT GALLERY
  // =========================================================

  const mainImage = document.getElementById("product-main-image");
  const thumbnails = document.querySelectorAll(".product-thumbnail");

  let activeImageIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function changeProductImage(index) {
    if (!mainImage || thumbnails.length === 0) return;

    activeImageIndex = (index + thumbnails.length) % thumbnails.length;

    const activeThumbnail = thumbnails[activeImageIndex];

    mainImage.src = activeThumbnail.dataset.image;

    thumbnails.forEach((thumbnail, i) => {
      const isActive = i === activeImageIndex;

      thumbnail.classList.toggle("active", isActive);
      thumbnail.setAttribute("aria-pressed", String(isActive));
    });
  }

  // Thumbnail click
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      changeProductImage(index);
    });
  });

  // Swipe gallery
  if (mainImage) {
    mainImage.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
      },
      { passive: true },
    );

    mainImage.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) < 45 || Math.abs(diffX) < Math.abs(diffY)) {
          return;
        }

        if (diffX < 0) {
          changeProductImage(activeImageIndex + 1);
        } else {
          changeProductImage(activeImageIndex - 1);
        }
      },
      { passive: true },
    );
  }

  // =========================================================
  // PRODUCT DETAIL & SHARE
  // =========================================================

  const productDetail = document.querySelector(".product-detail");

  if (!productDetail) return;

  const productName = productDetail.dataset.productName;
  const quantityInput = document.getElementById("product-qty");
  const minusButton = document.getElementById("product-qty-minus");
  const plusButton = document.getElementById("product-qty-plus");
  const addButton = document.getElementById("product-add-to-cart");
  // =========================================================
  // PRODUCT VARIANTS
  // =========================================================

  const variantGroups = document.querySelectorAll("[data-variant-group]");
  const variantButtons = document.querySelectorAll("[data-variant-option]");
  const productPriceElement = productDetail.querySelector(".product-price");

  let selectedVariant = null;
  let selectedOptions = {};

  let variantData = [];

  try {
    variantData = JSON.parse(productDetail.dataset.productVariants || "[]");
  } catch (error) {
    console.error("Data varian produk tidak valid:", error);
  }

  if (variantGroups.length > 0 && variantData.length > 0) {
    variantButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const groupIndex = button.dataset.variantAttribute;
        const option = button.dataset.variantOption;

        selectedOptions[groupIndex] = option;

        // Update tampilan pilihan
        variantButtons.forEach((item) => {
          if (item.dataset.variantAttribute === groupIndex) {
            const isSelected = item === button;

            item.classList.toggle("active", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
          }
        });

        const isComplete =
          Object.keys(selectedOptions).length === variantGroups.length;

        if (!isComplete) {
          selectedVariant = null;

          return;
        }

        // Cari kombinasi varian yang cocok
        const options = variantGroups.length
          ? Array.from(variantGroups, (_, index) => selectedOptions[index])
          : [];

        const combination = variantData.find(
          (variant) =>
            variant.options.length === options.length &&
            variant.options.every((option, index) => option === options[index]),
        );

        if (!combination) {
          selectedVariant = null;

          return;
        }

        selectedVariant = combination;
        productPrice = Number(combination.price);

        // Update harga
        if (productPriceElement) {
          productPriceElement.textContent = new Intl.NumberFormat(
            "id-ID",
          ).format(combination.price);
        }

        // Update gambar utama
        if (mainImage && combination.image) {
          mainImage.src = combination.image;
        }

        addButton?.removeAttribute("disabled");
      });
    });
  }

  const shareButton = document.getElementById("detail-share-btn");

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const productDescription = productDetail.dataset.productDescription;
      const productUrl = window.location.href;

      const shareData = {
        title: productName,
        text:
          "Temukan " +
          productName +
          " di Suuqy Store.\n\n" +
          productDescription +
          "\n\nLihat detail produk dan pesan di sini:",
        url: productUrl,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(
            shareData.text + "\n" + productUrl,
          );

          alert("Link produk berhasil disalin.");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Gagal membagikan produk:", error);
        }
      }
    });
  }

  // ===================================
  // PRODUCT QUANTITY & ADD TO CART
  // ===================================

  if (!quantityInput || !minusButton || !plusButton || !addButton) {
    return;
  }

  let productPrice = Number(productDetail.dataset.productPrice);

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

    if (variantGroups.length > 0 && !selectedVariant) {
      console.log("Validasi varian terpanggil");
      showAlert("Silakan pilih varian produk terlebih dahulu.");
      return;
    }

    if (typeof addToCart !== "function") {
      console.error("Fungsi keranjang belum tersedia.");
      return;
    }

    const finalPrice = selectedVariant
      ? Number(selectedVariant.price)
      : productPrice;

    for (let i = 0; i < quantity; i++) {
      addToCart(productName, finalPrice, selectedVariant);
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
