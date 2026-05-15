export interface BehavioralIndicator {
  level: number;
  label: string;
  description: string;
  examples: string[];
}

export interface Competency {
  key: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  indicators: BehavioralIndicator[];
}

export const COMPETENCIES: Competency[] = [
  {
    key: "strategic_thinking",
    name: "Pemikiran Strategis",
    nameEn: "Strategic Thinking",
    description: "Kemampuan untuk melihat gambaran besar, menganalisis situasi secara menyeluruh, dan merumuskan arah jangka panjang yang tepat bagi organisasi.",
    icon: "🎯",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Fokus pada tugas sehari-hari tanpa mempertimbangkan dampak jangka panjang.",
        examples: [
          "Hanya mengerjakan tugas yang diberikan tanpa memikirkan konteks yang lebih besar.",
          "Tidak dapat menghubungkan pekerjaan harian dengan tujuan organisasi.",
          "Bereaksi terhadap masalah tanpa mempertimbangkan penyebab mendasar.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai memahami konteks bisnis dan dapat menghubungkan tugas dengan tujuan tim.",
        examples: [
          "Memahami tujuan tim dan bagaimana tugasnya berkontribusi pada tujuan tersebut.",
          "Sesekali mengajukan pertanyaan tentang arah strategis departemen.",
          "Dapat mengidentifikasi beberapa tren yang relevan dengan pekerjaannya.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu menganalisis situasi bisnis dan memberikan kontribusi pada perencanaan strategis.",
        examples: [
          "Secara aktif menganalisis tren pasar dan dampaknya terhadap tim.",
          "Memberikan masukan strategis yang relevan dalam diskusi perencanaan.",
          "Dapat menyeimbangkan kebutuhan jangka pendek dengan tujuan jangka panjang.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Secara konsisten menerapkan pemikiran strategis dalam pengambilan keputusan dan perencanaan.",
        examples: [
          "Merumuskan strategi departemen yang selaras dengan visi organisasi.",
          "Mengidentifikasi peluang dan ancaman bisnis secara proaktif.",
          "Memimpin diskusi strategis dan menginspirasi tim untuk berpikir lebih jauh.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Menjadi pemimpin strategis yang visioner dan mampu mentransformasi organisasi.",
        examples: [
          "Merumuskan visi jangka panjang yang menginspirasi seluruh organisasi.",
          "Mengantisipasi perubahan industri dan memposisikan organisasi secara strategis.",
          "Menjadi acuan bagi pemimpin lain dalam hal pemikiran dan perencanaan strategis.",
        ],
      },
    ],
  },
  {
    key: "leadership",
    name: "Kepemimpinan",
    nameEn: "Leadership",
    description: "Kemampuan untuk menginspirasi, memotivasi, dan membimbing orang lain menuju pencapaian tujuan bersama.",
    icon: "👑",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Belum menunjukkan inisiatif kepemimpinan dan cenderung menunggu arahan.",
        examples: [
          "Hanya mengikuti instruksi tanpa mengambil inisiatif.",
          "Tidak memberikan arahan atau dukungan kepada rekan kerja.",
          "Menghindari tanggung jawab kepemimpinan.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai menunjukkan potensi kepemimpinan dalam situasi tertentu.",
        examples: [
          "Sesekali membantu rekan kerja yang membutuhkan panduan.",
          "Bersedia mengambil peran pemimpin dalam proyek kecil.",
          "Mulai membangun kepercayaan dalam tim.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu memimpin tim kecil dan mencapai hasil yang diharapkan.",
        examples: [
          "Memimpin rapat tim dengan efektif dan memastikan semua suara didengar.",
          "Memberikan umpan balik yang konstruktif kepada anggota tim.",
          "Mengelola konflik dalam tim dengan cara yang produktif.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Memimpin dengan efektif, menginspirasi tim, dan mengembangkan potensi anggota.",
        examples: [
          "Menciptakan lingkungan tim yang inklusif dan mendorong inovasi.",
          "Secara aktif mengembangkan kompetensi anggota tim melalui coaching.",
          "Memimpin perubahan dengan mengelola resistensi secara efektif.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin transformasional yang menginspirasi dan mengembangkan pemimpin lainnya.",
        examples: [
          "Membangun budaya kepemimpinan yang kuat di seluruh organisasi.",
          "Mengidentifikasi dan mengembangkan pemimpin masa depan.",
          "Diakui sebagai role model kepemimpinan di dalam dan luar organisasi.",
        ],
      },
    ],
  },
  {
    key: "communication",
    name: "Komunikasi",
    nameEn: "Communication",
    description: "Kemampuan untuk menyampaikan pesan dengan jelas, mendengarkan secara aktif, dan membangun hubungan yang efektif.",
    icon: "💬",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Komunikasi sering tidak jelas dan kurang efektif dalam berbagai situasi.",
        examples: [
          "Pesan yang disampaikan sering disalahpahami oleh orang lain.",
          "Jarang mendengarkan dengan penuh perhatian saat orang lain berbicara.",
          "Kesulitan menyesuaikan gaya komunikasi dengan audiens yang berbeda.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Komunikasi cukup jelas dalam situasi rutin namun masih perlu pengembangan.",
        examples: [
          "Dapat menyampaikan informasi rutin dengan cukup jelas.",
          "Mulai memperhatikan kebutuhan audiens dalam berkomunikasi.",
          "Sesekali mengajukan pertanyaan klarifikasi untuk memastikan pemahaman.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Berkomunikasi dengan efektif dalam berbagai situasi dan audiens.",
        examples: [
          "Menyampaikan presentasi yang terstruktur dan mudah dipahami.",
          "Mendengarkan secara aktif dan merespons dengan tepat.",
          "Menyesuaikan gaya komunikasi sesuai dengan audiens.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Komunikator yang sangat efektif dan mampu mempengaruhi orang lain.",
        examples: [
          "Menyampaikan pesan kompleks dengan cara yang mudah dipahami semua pihak.",
          "Membangun narasi yang meyakinkan untuk mendukung ide dan proposal.",
          "Memfasilitasi diskusi yang produktif antara pihak-pihak yang berbeda pandangan.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Komunikator kelas dunia yang mampu menginspirasi dan menggerakkan orang.",
        examples: [
          "Pidato dan presentasi yang menginspirasi dan diingat oleh audiens.",
          "Membangun kepercayaan dan hubungan yang kuat melalui komunikasi yang autentik.",
          "Menjadi juru bicara organisasi yang efektif di berbagai forum.",
        ],
      },
    ],
  },
  {
    key: "problem_solving",
    name: "Pemecahan Masalah",
    nameEn: "Problem Solving",
    description: "Kemampuan untuk mengidentifikasi masalah secara tepat, menganalisis penyebab, dan menemukan solusi yang efektif.",
    icon: "🔍",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Kesulitan mengidentifikasi dan menyelesaikan masalah secara mandiri.",
        examples: [
          "Membutuhkan bantuan untuk menyelesaikan masalah rutin.",
          "Cenderung menghindari atau menunda penanganan masalah.",
          "Tidak dapat membedakan gejala dari akar penyebab masalah.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Dapat menyelesaikan masalah sederhana dengan bantuan minimal.",
        examples: [
          "Dapat menyelesaikan masalah rutin secara mandiri.",
          "Mulai menggunakan pendekatan sistematis dalam memecahkan masalah.",
          "Mencari bantuan ketika menghadapi masalah yang kompleks.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu menganalisis dan menyelesaikan masalah yang cukup kompleks.",
        examples: [
          "Menggunakan metode analisis untuk mengidentifikasi akar penyebab masalah.",
          "Menghasilkan beberapa alternatif solusi sebelum memilih yang terbaik.",
          "Mengevaluasi efektivitas solusi yang diterapkan.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Pemecah masalah yang handal dengan pendekatan sistematis dan kreatif.",
        examples: [
          "Mengantisipasi masalah sebelum terjadi dan menyiapkan solusi preventif.",
          "Menerapkan pendekatan inovatif untuk masalah yang belum pernah dihadapi sebelumnya.",
          "Membimbing tim dalam proses pemecahan masalah yang kompleks.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Ahli pemecahan masalah yang mampu menangani tantangan paling kompleks.",
        examples: [
          "Menyelesaikan masalah lintas fungsi yang berdampak besar pada organisasi.",
          "Mengembangkan metodologi pemecahan masalah yang diadopsi oleh organisasi.",
          "Diakui sebagai go-to person untuk masalah-masalah yang paling sulit.",
        ],
      },
    ],
  },
  {
    key: "decision_making",
    name: "Pengambilan Keputusan",
    nameEn: "Decision Making",
    description: "Kemampuan untuk membuat keputusan yang tepat, tepat waktu, dan berdasarkan analisis yang komprehensif.",
    icon: "⚖️",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Sering ragu dalam mengambil keputusan dan membutuhkan banyak arahan.",
        examples: [
          "Menghindari pengambilan keputusan dan selalu menunggu instruksi atasan.",
          "Keputusan yang diambil sering tidak konsisten atau berubah-ubah.",
          "Tidak mempertimbangkan risiko dan dampak dari keputusan.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Dapat mengambil keputusan rutin dengan tingkat kepercayaan diri yang tumbuh.",
        examples: [
          "Mengambil keputusan operasional sehari-hari secara mandiri.",
          "Mulai mempertimbangkan beberapa faktor sebelum mengambil keputusan.",
          "Belajar dari keputusan yang kurang tepat untuk perbaikan ke depan.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mengambil keputusan berdasarkan analisis yang cukup baik dan tepat waktu.",
        examples: [
          "Mengumpulkan dan menganalisis data yang relevan sebelum memutuskan.",
          "Mempertimbangkan dampak keputusan terhadap berbagai pemangku kepentingan.",
          "Mengambil keputusan dengan keyakinan dalam situasi yang cukup kompleks.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Pengambil keputusan yang efektif bahkan dalam situasi yang tidak pasti.",
        examples: [
          "Mengambil keputusan strategis dengan analisis risiko yang komprehensif.",
          "Memimpin proses pengambilan keputusan kelompok yang efektif.",
          "Berani mengambil keputusan sulit yang tidak populer namun tepat untuk organisasi.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin keputusan yang diakui kemampuannya dalam situasi paling kritis.",
        examples: [
          "Membuat keputusan transformasional yang mengubah arah organisasi.",
          "Mengembangkan framework pengambilan keputusan yang digunakan oleh seluruh organisasi.",
          "Diakui sebagai pemimpin yang memiliki judgment terbaik dalam situasi krisis.",
        ],
      },
    ],
  },
  {
    key: "emotional_intelligence",
    name: "Kecerdasan Emosional",
    nameEn: "Emotional Intelligence",
    description: "Kemampuan untuk mengenali, memahami, dan mengelola emosi diri sendiri dan orang lain secara efektif.",
    icon: "❤️",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Kesulitan mengenali dan mengelola emosi diri sendiri maupun orang lain.",
        examples: [
          "Sering bereaksi secara emosional tanpa mempertimbangkan dampaknya.",
          "Tidak peka terhadap perasaan dan kebutuhan orang lain.",
          "Kesulitan membangun hubungan yang positif dengan rekan kerja.",
        ],
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai menyadari emosi diri dan dampaknya terhadap orang lain.",
        examples: [
          "Menyadari ketika emosi mempengaruhi perilaku dan mencoba mengendalikannya.",
          "Mulai memperhatikan sinyal emosional dari orang lain.",
          "Berusaha untuk tetap tenang dalam situasi yang menegangkan.",
        ],
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mengelola emosi dengan baik dan membangun hubungan yang positif.",
        examples: [
          "Tetap tenang dan profesional dalam situasi yang penuh tekanan.",
          "Menunjukkan empati yang tulus kepada rekan kerja yang menghadapi kesulitan.",
          "Membangun hubungan kerja yang positif dengan berbagai tipe kepribadian.",
        ],
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Kecerdasan emosional yang tinggi yang mendukung kepemimpinan yang efektif.",
        examples: [
          "Menggunakan kecerdasan emosional untuk memotivasi dan menginspirasi tim.",
          "Mengelola dinamika emosional dalam tim dengan sangat efektif.",
          "Membangun kepercayaan yang mendalam melalui keaslian dan empati.",
        ],
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin dengan kecerdasan emosional luar biasa yang menjadi teladan.",
        examples: [
          "Menciptakan budaya organisasi yang secara emosional sehat dan produktif.",
          "Memimpin transformasi budaya melalui kecerdasan emosional yang tinggi.",
          "Diakui sebagai pemimpin yang paling dipercaya dan dihormati di organisasi.",
        ],
      },
    ],
  },
];

export const COMPETENCY_KEYS = COMPETENCIES.map((c) => c.key);
export const COMPETENCY_MAP = Object.fromEntries(COMPETENCIES.map((c) => [c.key, c]));
