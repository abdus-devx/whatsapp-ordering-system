document.addEventListener("DOMContentLoaded", () => {
  const sbcButtons = document.querySelectorAll(".sbc-item");

  sbcButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.sbcCategory;

      sbcButtons.forEach((item) => {
        item.classList.remove("sbc-active");
      });

      button.classList.add("sbc-active");

      filterProducts();
    });
  });
});
