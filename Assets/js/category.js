/* =========================================================
   SHOP BY CATEGORY
   PREFIX: sbc-
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const sbcButtons = document.querySelectorAll(
    ".sbc-item"
  );

  const sbcProducts = document.querySelectorAll(
    "#prd-container .prd-card"
  );


  sbcButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedCategory =
        button.dataset.sbcCategory;


      /* ==============================
         ACTIVE BUTTON
      ============================== */

      sbcButtons.forEach((item) => {
        item.classList.remove("sbc-active");
      });

      button.classList.add("sbc-active");


      /* ==============================
         FILTER PRODUCT
      ============================== */

      sbcProducts.forEach((product) => {

        const productCategory =
          product.dataset.sbcCategory;


        if (
          selectedCategory === "all" ||
          productCategory === selectedCategory
        ) {

          product.classList.remove(
            "sbc-hidden"
          );

        } else {

          product.classList.add(
            "sbc-hidden"
          );

        }

      });

    });

  });

});