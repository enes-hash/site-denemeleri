export type FamilyCategory = 'all' | 'elders' | 'children' | 'grandchildren';

export interface FamilyPhoto {
  id: string;
  src: string;
  title: string;
  roleLabel: string;
  generation: string;
  category: Exclude<FamilyCategory, 'all'>;
  secondaryCategory?: Exclude<FamilyCategory, 'all'>;
  caption: string;
  featured?: boolean;
}

export interface GodfatherPillar {
  id: string;
  tabLabel: string;
  subtitle: string;
  title: string;
  quote: string;
  description: string;
  principles: string[];
}

const assetPath = (fileName: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}assets/aistudio/${fileName}`;
};

/**
 * Kodak Ailesi Özel Giriş Şifreleri
 * Canlıya almadan önce bu listeden şifreyi dilediğiniz gibi değiştirebilirsiniz.
 */
export const FAMILY_ACCESS_CODES = ['kodak', 'kodak1978', 'mehmetkodak'];

export const PATRIARCH_PORTRAITS = {
  rose: assetPath('Ekran_g_r_nt_s__2026-11-25_122752_d7aad022.png'),
  bakery: assetPath('WhatsApp_Image_2026-11-25_at_12.21.55_ee338013.jpeg'),
  bridge: assetPath('WhatsApp_Image_2026-11-25_at_12.31.48_2db26dd2.jpeg'),
  withGrandchild: assetPath('WhatsApp_Image_2026-11-25_at_12.33.43_d0d6de01.jpeg'),
};

export const GODFATHER_FAMILY_QUOTES = [
  {
    quote: 'İnsan kendi ailesine sırtını dönemez; ne olursa olsun aynı masada buluşur.',
    author: 'The Godfather · Aile Bağlılığı',
  },
  {
    quote: 'Gerçek güç gürültüde değil; sessizce sözünün arkasında duran babanın vakarındadır.',
    author: 'Baba Ocağı Düsturu',
  },
  {
    quote: 'Bir ailenin gerçek serveti, birbirine sımsıkı kenetlenmiş fertleridir.',
    author: 'Kodak Ailesi İlkesi',
  },
];

export const KODAK_FIRIN_CHAPTERS: GodfatherPillar[] = [
  {
    id: 'ocak',
    tabLabel: 'Kodak Fırın',
    subtitle: 'Ailenin Kalesi · Güngören',
    title: 'Kodak Fırın: Bir İsimden Fazlası',
    quote: '“Bir adam ailesine vakit ayırmıyorsa asla gerçek bir adam olamaz.”',
    description:
      'Kodak Fırın yalnızca bir ekmek teknesi değil; Mehmet Kodak’ın yıllar boyunca evlatlarına ve torunlarına emanet ettiği ortak çatıdır. Kapıdan giren herkes burada emeğin, sadakatin ve aile ağırlığının sıcaklığını hisseder.',
    principles: ['Mehmet Kodak İmzası', 'Ortak Aile Sofrası', 'Sarsılmaz Güven'],
  },
  {
    id: 'emanet',
    tabLabel: 'Aile Sözü',
    subtitle: 'Baba Öğüdü · Sadakat',
    title: 'Sözün Ağırlığı ve Vefa',
    quote: '“Dostlarını yakın tut, aileni ise daima kalbinin merkezinde tut.”',
    description:
      'Kodak Fırın’ın her taşında bir söz, her sabahında omuz omuza verilen bir aile dayanışması vardır. Büyüklerin duası, gençlerin gayretiyle birleştiğinde bu ocak nesiller boyu yanmaya devam eder.',
    principles: ['Aileye Koşulsuz Bağlılık', 'Büyüğe Hürmet', 'Küçüğe Şefkat'],
  },
  {
    id: 'gelecek',
    tabLabel: 'Miras',
    subtitle: 'Çocuklar ve Torunlar',
    title: 'Üç Kuşağa Uzanan Kodak Adı',
    quote: '“Gerçek servet kasada değil; aynı soyadını gururla taşıyan evlatlarındadır.”',
    description:
      'Mehmet Kodak’ın kurduğu Kodak Fırın çatısı altında yetişen evlatlar ve bugün o ocağın neşesi olan torunlar, aynı masanın etrafında yarınlara yürümektedir.',
    principles: ['Nesilden Nesile İtibar', 'Kardeşlik Hukuku', 'Ebedi Aile Birliği'],
  },
];

export const FAMILY_PHOTOS: FamilyPhoto[] = [
  {
    id: 'mehmet-rose',
    src: PATRIARCH_PORTRAITS.rose,
    title: 'Mehmet Kodak',
    roleLabel: 'Ailenin Reisi · Baba',
    generation: '1. Kuşak',
    category: 'elders',
    caption: 'Yakasında değil elinde taşıdığı kırmızı gülü, vakur duruşu ve ömürlük tebessümüyle Baba Mehmet Kodak.',
    featured: true,
  },
  {
    id: 'mehmet-firin',
    src: PATRIARCH_PORTRAITS.bakery,
    title: 'Kodak Fırın Başında',
    roleLabel: 'Baba · Kodak Fırın',
    generation: '1. Kuşak',
    category: 'elders',
    caption: 'Güngören Kodak Fırın’da, emeğin ve bereketin başında Mehmet Kodak.',
    featured: true,
  },
  {
    id: 'anne-baba-kopru',
    src: PATRIARCH_PORTRAITS.bridge,
    title: 'Ailenin İki Direği',
    roleLabel: 'Anne ve Baba',
    generation: '1. Kuşak',
    category: 'elders',
    caption: 'Orman içindeki ahşap köprüde, yılların emeğini ve huzurunu paylaşan büyüklerimiz.',
  },
  {
    id: 'dede-torun',
    src: PATRIARCH_PORTRAITS.withGrandchild,
    title: 'Dede ve Minik Torunu',
    roleLabel: 'Mehmet Kodak · Torunu',
    generation: '1. & 3. Kuşak',
    category: 'elders',
    secondaryCategory: 'grandchildren',
    caption: 'Mehmet Kodak kucağında torunuyla aile arşivi için objektif karşısında.',
  },
  {
    id: 'cocuklar-ve-torun-gol',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.31.45_2632e2c8.jpeg'),
    title: 'Göl Kenarında Üçlü Mutluluk',
    roleLabel: 'Evlatlarımız · Torunumuz',
    generation: '2. & 3. Kuşak',
    category: 'children',
    secondaryCategory: 'grandchildren',
    caption: 'Güneşli bir günde göl kıyısında ailemizin genç kuşağı ve yakışıklı torunumuz.',
  },
  {
    id: 'cift-magaza',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.33.24_1f94da61.jpeg'),
    title: 'Zarif Bir Gün Hatırası',
    roleLabel: 'Evlatlarımız',
    generation: '2. Kuşak',
    category: 'children',
    caption: 'Güler yüzleri ve uyumlu duruşlarıyla Kodak Ailesi’nin kıymetli genç çifti.',
  },
  {
    id: 'kapi-onu-aile',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.37.56_1ead91a3.jpeg'),
    title: 'Sarı Şapkalı Torunla Hatıra',
    roleLabel: 'Evlatlarımız · Torunumuz',
    generation: '2. & 3. Kuşak',
    category: 'children',
    secondaryCategory: 'grandchildren',
    caption: 'Anne, baba ve sıcacık gülümsemesiyle evin neşesi olan torunumuz bir arada.',
  },
  {
    id: 'kardesler-yuruyus',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.39.30_7b09d919.jpeg'),
    title: 'Akşamüstü Birlikteliği',
    roleLabel: 'Evlatlarımız',
    generation: '2. Kuşak',
    category: 'children',
    caption: 'Aynı yolda omuz omuza yürüyen kardeşler ve eksilmeyen aile bağı.',
  },
  {
    id: 'mutlu-ikili',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.33.05_bcca1d24.jpeg'),
    title: 'İçten Tebessümler',
    roleLabel: 'Evlatlarımız',
    generation: '2. Kuşak',
    category: 'children',
    caption: 'Samimiyetin ve sevginin kadraja yansıdığı sıcak bir aile anı.',
  },
  {
    id: 'abi-kardes',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.34.45_c83a78a8.jpeg'),
    title: 'Abi ve Kardeş Neşesi',
    roleLabel: 'Evlatlarımız · Gençlerimiz',
    generation: '2. & 3. Kuşak',
    category: 'children',
    secondaryCategory: 'grandchildren',
    caption: 'Birlikte güldükçe büyüyen kardeşlik ve evimizin enerjisi.',
  },
  {
    id: 'agabey-bebek-torun',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.28.00_034672a7.jpeg'),
    title: 'İki Torunumuz Bir Arada',
    roleLabel: 'Torunlarımız',
    generation: '3. Kuşak',
    category: 'grandchildren',
    caption: 'Ağabeyinin şefkatli kollarında Kodak Ailesi’nin minik prensesi.',
  },
  {
    id: 'bebek-torun-pembe',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.33.55_8b1d0b11.jpeg'),
    title: 'En Taze Goncamız',
    roleLabel: 'Torunumuz',
    generation: '3. Kuşak',
    category: 'grandchildren',
    caption: 'Kocaman meraklı gözleriyle ailenin yeni neslini müjdeleyen minik torunumuz.',
  },
  {
    id: 'bebek-torun-yesil',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.33.27_a90cfe18.jpeg'),
    title: 'Evin Nazlı Küçüğü',
    roleLabel: 'Torunumuz',
    generation: '3. Kuşak',
    category: 'grandchildren',
    caption: 'Tatlı mimiğiyle büyüklerin gönlünü fetheden kıymetli torunumuz.',
  },
  {
    id: 'genc-delikanli',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.37.47_cdb13e0f.jpeg'),
    title: 'Ailenin Delikanlısı',
    roleLabel: 'Evladımız',
    generation: '2. Kuşak',
    category: 'children',
    caption: 'Kendine has tarzı ve gençlik enerjisiyle Kodak Ailesi’nin delikanlısı.',
  },
  {
    id: 'yayla-kuzu',
    src: assetPath('WhatsApp_Image_2026-11-25_at_12.37.52_d7614df7.jpeg'),
    title: 'Yaylada Merhamet Anı',
    roleLabel: 'Evladımız',
    generation: '2. Kuşak',
    category: 'children',
    caption: 'Toprağa ve doğaya duyulan sevginin en duru hatırası.',
  },
];
