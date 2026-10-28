const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const productsFile = path.join(rootDir, "Assets/js/products.js");
const outputDir = path.join(rootDir, "produk");

const source = fs.readFileSync(productsFile, "utf8");
const sandbox = {};

vm.runInNewContext(`${source}\nglobalThis.__products = products;`, sandbox);

const products = sandbox.__products;

if (!Array.isArray(products) || products.length === 0) {
  throw new Error("Data produk tidak ditemukan.");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

const usedSlugs = new Set();

function createProductPage(product) {
  const slug = slugify(product.slug || product.name);

  if (!slug) {
    throw new Error(`Slug tidak valid untuk produk ID ${product.id}.`);
  }

  if (usedSlugs.has(slug)) {
    throw new Error(`Slug duplikat ditemukan: "${slug}".`);
  }

  usedSlugs.add(slug);

  const name = escapeHtml(product.name);
  const description = escapeHtml(product.description || "");
  const image = escapeHtml(
    path.posix.join("/Assets/images", path.posix.basename(product.image || "")),
  );
  const price = Number(product.price);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Harga tidak valid untuk produk "${product.name}".`);
  }

  const canonical = `https://store.massusi.net/produk/${slug}/`;

  return {
    slug,
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Toko Massusi</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${name} | Toko Massusi">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://store.massusi.net${image}">
  <link rel="icon" type="image/png" href="/Assets/images/favicon500.png">
  <link rel="stylesheet" href="/Assets/css/style.css">
  <link rel="stylesheet" href="/Assets/css/utils.css">
  <style>
    .product-detail{max-width:1100px;margin:36px auto;padding:0 20px;font-family:Poppins,sans-serif;color:#24332d}
    .product-breadcrumb{margin-bottom:24px;font-size:13px;color:#68766f}
    .product-breadcrumb a{color:inherit;text-decoration:none}
    .product-layout{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
    .product-gallery{padding:20px;background:#f7f8f5;border-radius:18px}
    .product-image{display:block;width:100%;height:420px;object-fit:contain}
    .product-category{color:#367454;font-size:13px;font-weight:600;text-transform:uppercase}
    .product-title{margin:12px 0;font-size:clamp(26px,4vw,36px);line-height:1.35}
    .product-price{margin:20px 0;color:#176b48;font-size:28px;font-weight:700}
    .product-description{color:#637069;line-height:1.8}
    .product-buy{display:block;margin-top:24px;padding:15px 20px;border-radius:10px;background:#176b48;color:white;text-align:center;text-decoration:none;font-weight:600}
    .product-info{margin-top:30px;line-height:1.8}
    @media(max-width:700px){.product-layout{grid-template-columns:1fr;gap:24px}.product-image{height:300px}}
  </style>
</head>
<body>
  <main class="product-detail">
    <nav class="product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Beranda</a> / ${name}
    </nav>
    <section class="product-layout">
      <div class="product-gallery">
        <img class="product-image" src="${image}" alt="${name}" fetchpriority="high">
      </div>
      <div>
        <span class="product-category">${escapeHtml(product.category || "Produk Massusi")}</span>
        <h1 class="product-title">${name}</h1>
        <p class="product-price">${formatPrice(price)}</p>
        <p class="product-description">${description}</p>
        <a class="product-buy" href="https://wa.me/?text=${encodeURIComponent(`Halo Massusi, saya ingin bertanya tentang ${product.name}.`)}" target="_blank" rel="noopener noreferrer">Pesan melalui WhatsApp</a>
        <div class="product-info">
          <h2>Informasi Produk</h2>
          <p>Silakan periksa label kemasan untuk informasi komposisi, aturan pakai, dan penyimpanan produk.</p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`,
  };
}

fs.mkdirSync(outputDir, { recursive: true });

for (const product of products) {
  const page = createProductPage(product);
  const productDir = path.join(outputDir, page.slug);

  fs.mkdirSync(productDir, { recursive: true });
  fs.writeFileSync(path.join(productDir, "index.html"), page.html, "utf8");

  console.log(`Generated: /produk/${page.slug}/`);
}

console.log(`Selesai. ${products.length} halaman produk dibuat.`);
