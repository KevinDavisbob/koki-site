import type { Locale } from "@/i18n/routing";

export type BookStatus = "reading" | "finished" | "want";

export type Book = {
  title: string;
  author: string;
  status: BookStatus;
  /** 1-5 星，仅已读的书 */
  rating?: number;
  note?: string;
};

// TODO: 换成你真实的书单
const zh: Book[] = [
  {
    title: "C++ Primer（中文版）",
    author: "Stanley B. Lippman 等",
    status: "reading",
    note: "配合黑马课一起看，进度到第 6 章。",
  },
  {
    title: "Hello 算法",
    author: "靳宇栋（krahets）",
    status: "want",
    note: "开源图解开源书，学数据结构前先翻一遍。",
  },
  {
    title: "算法图解",
    author: "Aditya Bhargava",
    status: "finished",
    rating: 4,
    note: "漫画讲算法，适合建立直觉，细节需要配合其他书补。",
  },
  {
    title: "编码：隐匿在计算机软硬件背后的语言",
    author: "Charles Petzold",
    status: "want",
    note: "想理解计算机底层原理，从这本开始。",
  },
];

const en: Book[] = [
  {
    title: "C++ Primer",
    author: "Stanley B. Lippman et al.",
    status: "reading",
    note: "Reading alongside a beginner course — currently in chapter 6.",
  },
  {
    title: "Hello Algo",
    author: "krahets",
    status: "want",
    note: "Free open-source illustrated book — flip through before diving into DSA.",
  },
  {
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    status: "finished",
    rating: 4,
    note: "Comics-style intro to algorithms; pair it with a more detailed book afterwards.",
  },
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    author: "Charles Petzold",
    status: "want",
    note: "The best starting point for understanding how computers actually work.",
  },
];

const data: Record<Locale, Book[]> = { zh, en };

export function getBooks(locale: Locale): Book[] {
  return data[locale];
}
