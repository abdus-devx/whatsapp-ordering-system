const products = [
  {
    id: 1,
    slug: "kapsul-sari-ikan-gabus",
    name: "Kapsul Sari Ikan Gabus",
    category: "kapsul",
    oldPrice: 199000,
    price: 170000,

    // Foto katalog dan galeri detail
    image: "./Assets/images/sig1.png",
    images: [
      "./Assets/images/sig1.png",
      "./Assets/images/sig1-detail-1.png",
      "./Assets/images/sig1-detail-2.png",
      "./Assets/images/sig1-kemasan.png",
    ],

    // Informasi ringkas untuk katalog
    shortDescription: "Ekstrak ikan gabus dalam bentuk kapsul yang praktis.",
    description:
      "Cocok untuk: Pemulihan luka pasca-operasi dan melahirkan, memperbaiki masalah gizi buruk dan meningkatkan stamina.",

    // Informasi khusus halaman detail
    detail: {
      overview: `🐟 Kapsul Sari Ikan Gabus (Ekstrak Albumin Tinggi) 
        
        Kapsul Sari Ikan Gabus adalah suplemen kesehatan herbal alami yang diekstrak dari murni Ikan Gabus / Kutuk (Channa striata) pilihan berkualitas tinggi. Kaya akan kandungan Protein Albumin, Asam Amino, serta Nutrisi Esensial yang diproses secara higienis dan modern sehingga tidak berbau amis.`,

      highlights: [
        "Menggunakan ekstrak ikan gabus pilihan",
        "Kandungan albumin dan asam amino",
        "Diproses secara higienis",
        "Praktis dalam bentuk kapsul",
      ],

      benefits: [
        "🩸 Mempercepat Penyembuhan Luka: Efektif mengeringkan luka jahitan pasca operasi (secara sesar/caesar, dll), luka bakar, hingga luka akibat diabetes",
        "🧬 Kaya Protein Albumin: Membantu memenuhi kebutuhan protein serum albumin di dalam darah",
        "🛡️ Meningkatkan Daya Tahan Tubuh: Menjaga kekebalan tubuh agar tidak mudah sakit dan mempercepat masa pemulihan dari sakit.",
      ],
      composition: "Ekstrak Ikan Gabus 5x lebih kuat dari ekstrak biasa",
      usage:
        "Diminum 2 kali sehari, masing-masing 1-2 kapsul, diminum saat perut kosong",
      packaging: "60 kapsul",
      legality: {
        bpom: "TR243003241",
        halal: "",
      },
    },

    bestseller: true,
    promo: false,
  },
  {
    id: 2,
    slug: "madu-arjuna-pria-dewasa",
    name: "Madu Arjuna (Pria Dewasa)",
    category: "madu",
    oldPrice: 179000,
    price: 150000,

    image: "./Assets/images/sig3.png",
    images: ["./Assets/images/sig3.png"],

    shortDescription:
      "Madu herbal untuk pria dewasa dengan fokus pada vitalitas dan stamina.",
    description:
      "Madu Arjuna merupakan produk madu herbal untuk pria dewasa. Informasi mengenai karakteristik, komposisi, dan aturan pakai perlu mengacu pada keterangan resmi produk.",

    detail: {
      overview:
        "Madu Arjuna adalah produk madu herbal yang ditujukan untuk pria dewasa.",
      benefits: [],
      composition: "",
      usage: "",
      packaging: "",
      legality: {
        bpom: "",
        halal: "",
      },
    },

    bestseller: true,
    promo: true,
  },
  {
    id: 3,
    slug: "kapsul-toper-30-kapsul",
    name: "Kapsul Toper (30 Kapsul)",
    category: "kapsul",
    price: 200000,

    image: "./Assets/images/sig2.png",
    images: ["./Assets/images/sig2.png"],

    shortDescription:
      "Produk herbal dalam bentuk kapsul dengan kemasan isi 30 kapsul.",
    description:
      "Kapsul Toper merupakan produk herbal berbentuk kapsul. Informasi lengkap mengenai karakteristik, komposisi, dan aturan pakai perlu mengacu pada keterangan resmi produk.",

    detail: {
      overview:
        "Kapsul Toper merupakan produk herbal dalam bentuk kapsul dengan kemasan isi 30 kapsul.",
      benefits: [],
      composition: "",
      usage: "",
      packaging: "30 kapsul",
      legality: {
        bpom: "",
        halal: "",
      },
    },

    bestseller: true,
    promo: false,
  },
  {
    id: 4,
    slug: "madu-ginseng-330g",
    name: "Madu Ginseng (330g)",
    category: "madu",
    price: 190000,

    image: "./Assets/images/ginseng_madu.avif",
    images: ["./Assets/images/ginseng_madu.avif"],

    shortDescription: "Madu ginseng dalam kemasan 330 gram.",
    description:
      "Madu Ginseng merupakan produk madu dengan ginseng dalam kemasan 330 gram. Informasi mengenai komposisi, karakteristik, dan aturan pakai perlu mengacu pada keterangan resmi produk.",

    detail: {
      overview:
        "Madu Ginseng merupakan produk madu dengan ginseng dalam kemasan 330 gram.",
      benefits: [],
      composition: "",
      usage: "",
      packaging: "330 gram",
      legality: {
        bpom: "",
        halal: "",
      },
    },

    bestseller: false,
    promo: false,
  },
];
