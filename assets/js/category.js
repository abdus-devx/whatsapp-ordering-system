document.addEventListener("DOMContentLoaded", () => {
  const sbcButtons = document.querySelectorAll(".sbc-item");
  const bottomNav = document.querySelector(".mobile-bottom-nav");

  if (bottomNav) {
    const navItems = bottomNav.querySelectorAll("a, button");

    navItems.forEach((item) => {
      if (item.matches('button[onclick="toggleCart()"]')) return;

      item.addEventListener("click", () => {
        navItems.forEach((navItem) => {
          navItem.classList.remove("active");
        });

        item.classList.add("active");
      });
    });
  }

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
