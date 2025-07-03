export interface BooksTypeProps {
  title: string;
  file: string[];
  background: string;
}

export const BooksType: BooksTypeProps[] = [
  {
    title: "رحلات",
    file: [
      "0.json",
      "1.json",
      "2.json",
      "3.json",
      "4.json",
      "5.json",
      "6.json",
      "7.json",
      "8.json",
      "9.json",
      "10.json",
      "11.json",
      "12.json",
      "13.json",
      "14.json",
      "15.json",
      "16.json",
      "17.json",
      "18.json",
      "19.json",
      "20.json",
    ],
    background: "philosophy",
  },
  {
    title: "عقيدة",
    file: ["eman.json", "solok.json", "message007.json", "message002.json"],
    background: "islamic",
  },
  {
    title: "تربية",
    file: [
      "masjid.json",
      "jawhara.json",
      "mas.json",
      "wikaia.json",
      "message006.json",
      "shaikh.json",
      "Muraqabah.json",
      "message003.json",
      "ikhlas.json",
      "khoshoo.json",
      "tall2.json",
      "tazkiah.json",
    ],
    background: "fantasy",
  },
  {
    title: "سياسة شرعية",
    file: ["shora.json", "kafaa.json", "message001.json"],
    background: "philosophy",
  },
  {
    title: "دعوة",
    file: ["hiwarat1.json", "hiwarat2.json", "dawa.json", "balaga.json"],
    background: "hadith",
  },
  {
    title: "فقه",
    file: ["hodood.json", "sabab.json", "hokm.json", "riddah.json"],
    background: "fiqh",
  },
  {
    title: "مقاصد",
    file: ["islamlive.json"],
    background: "history",
  },
  {
    title: "تفسير",
    file: ["hood.json", "jawhara.json"],
    background: "quran",
  },
  {
    title: "نحو",
    file: ["g1.json", "g2.json"],
    background: "literature",
  },

  {
    title: "ثقافة عامة",
    file: ["Iqra.json"],
    background: "science",
  },
];
