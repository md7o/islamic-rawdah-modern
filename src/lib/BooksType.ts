export interface BooksTypeProps {
  title: string;
  file: string[];
  background: string;
}

export const BooksType: BooksTypeProps[] = [
  {
    title: "تربية",
    file: ["per.json", "solok.json", "eman.json"],
    background: "romance",
  },
  {
    title: "عقيدة",
    file: ["ikhlas.json", "riddah.json", "wikaia.json"],
    background: "romance",
  },
  {
    title: "رحلات",
    file: ["per.json", "solok.json"],
    background: "romance",
  },
  {
    title: "فقه",
    file: ["hodood.json", "hokm.json", "kafaa.json"],
    background: "mystery",
  },
  {
    title: "دعوة",
    file: ["dawa.json", "islamlive.json", "mas.json"],
    background: "romance",
  },
  {
    title: "سياسة شرعية",
    file: ["shora.json", "hood.json"],
    background: "romance",
  },
  {
    title: "نحو",
    file: ["alnoor.json"],
    background: "romance",
  },
  {
    title: "تفسير",
    file: ["Iqra.json", "jawhara.json"],
    background: "romance",
  },
  {
    title: "مقاصد",
    file: ["sabab.json", "Muraqabah.json"],
    background: "romance",
  },
  {
    title: "ثقافة عامة",
    file: ["poet.json", "tall2.json", "tazkiah.json"],
    background: "romance",
  },
];
