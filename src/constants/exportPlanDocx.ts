import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

type PlanRow = {
  field: string;
  target: string;
  content: string;
};

const border = {
  top: { style: BorderStyle.SINGLE, size: 1 },
  bottom: { style: BorderStyle.SINGLE, size: 1 },
  left: { style: BorderStyle.SINGLE, size: 1 },
  right: { style: BorderStyle.SINGLE, size: 1 },
};

const p = (
  text: string,
  options?: {
    bold?: boolean;
    center?: boolean;
    italic?: boolean;
    size?: number;
    color?: string;
  },
) =>
  new Paragraph({
    alignment: options?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: String(text || "")
      .split(/\r?\n/)
      .flatMap((line, index, arr) => [
        new TextRun({
          text: line,
          bold: options?.bold,
          italics: options?.italic,
          size: options?.size || 22,
          color: options?.color,
          font: "Times New Roman",
        }),
        ...(index < arr.length - 1 ? [new TextRun({ break: 1 })] : []),
      ]),
  });

const cell = (
  text: string,
  width: number,
  options?: {
    bold?: boolean;
    center?: boolean;
    rowSpan?: number;
    columnSpan?: number;
    verticalTop?: boolean;
    italic?: boolean;
    size?: number;
  },
) =>
  new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    rowSpan: options?.rowSpan,
    columnSpan: options?.columnSpan,
    verticalAlign: options?.verticalTop
      ? VerticalAlign.TOP
      : VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    borders: border,
    children: [
      p(text, {
        bold: options?.bold,
        center: options?.center,
        italic: options?.italic,
        size: options?.size || 22,
      }),
    ],
  });

const groupByField = (rows: PlanRow[]) => {
  const map = new Map<string, PlanRow[]>();

  rows.forEach((row) => {
    if (!map.has(row.field)) map.set(row.field, []);
    map.get(row.field)!.push(row);
  });

  return Array.from(map.entries()).map(([field, items]) => ({
    field,
    items,
  }));
};

const getLogoBuffer = async () => {
  const res = await fetch("/icons/HVEdu-icon-512x512.png");
  return await res.arrayBuffer();
};

export async function exportPlanDocx(data: {
  rows: PlanRow[];
  title: string;
  child?: string;
  teacher?: string;
}) {
  const groups = groupByField(data.rows);
  const logoBuffer = await getLogoBuffer();

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: false,
      children: [
        cell("STT", 4, { bold: true, center: true, rowSpan: 2, size: 23 }),
        cell("Lĩnh\nvực", 11, {
          bold: true,
          center: true,
          rowSpan: 2,
          size: 23,
        }),
        cell("Mục tiêu", 30, {
          bold: true,
          center: true,
          rowSpan: 2,
          size: 23,
        }),
        cell("Mức độ hỗ trợ", 20, {
          bold: true,
          center: true,
          rowSpan: 2,
          size: 23,
        }),
        cell("Nội dung", 19, {
          bold: true,
          center: true,
          rowSpan: 2,
          size: 23,
        }),
      ],
    })
  ];

  groups.forEach((group, groupIndex) => {
    group.items.forEach((item, itemIndex) => {
      tableRows.push(
        new TableRow({
          height: { value: 520, rule: HeightRule.ATLEAST },
          children: [
            ...(itemIndex === 0
              ? [
                  cell(String(groupIndex + 1), 4, {
                    center: true,
                    rowSpan: group.items.length,
                    verticalTop: true,
                  }),
                  cell(group.field, 11, {
                    bold: true,
                    center: true,
                    rowSpan: group.items.length,
                    verticalTop: true,
                  }),
                ]
              : []),

            cell(`${itemIndex + 1}. ${item.target}`, 30, {
              verticalTop: true,
            }),

            cell(item.content || "", 20, {
              verticalTop: true,
            }),
          ],
        }),
      );
    });
  });

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: {
          value: 1200,
          rule: HeightRule.ATLEAST,
        },
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: border,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: logoBuffer,
                    transformation: {
                      width: 60,
                      height: 60,
                    },
                    type: "png",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            borders: border,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              p("TRUNG TÂM HỖ TRỢ PHÁT TRIỂN GIÁO DỤC VÀ HOÀ NHẬP HY VỌNG", {
                bold: true,
                color: "008000",
                size: 28,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.LANDSCAPE },
            margin: { top: 500, right: 500, bottom: 500, left: 500 },
          },
        },
        children: [
          headerTable,

          p(`KẾ HOẠCH CAN THIỆP THÁNG ${data.title}`, {
            bold: true,
            center: true,
            size: 30,
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 12,
            },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `KH.${data.title}.${data.child || "tre"}.docx`);
}
// export async function exportPlanTeacherDocx(data: {
//   rows: PlanRow[];
//   title: string;
//   child?: string;
//   birthChild?: string;
//   teacher?: string;
//   rangeTime?: string;
// }) {
//   const groups = groupByField(data.rows);
//   const logoBuffer = await getLogoBuffer();

//   const tableRows: TableRow[] = [
//     new TableRow({
//       tableHeader: false,
//       children: [
//         cell("STT", 4, { bold: true, center: true, rowSpan: 2, size: 23 }),
//         cell("Lĩnh\nvực", 11, {
//           bold: true,
//           center: true,
//           rowSpan: 2,
//           size: 23,
//         }),
//         cell("Mục tiêu/Hoạt động\ntrọng tâm", 30, {
//           bold: true,
//           center: true,
//           rowSpan: 2,
//           size: 23,
//         }),
//         cell("Chiến lược", 20, {
//           bold: true,
//           center: true,
//           rowSpan: 2,
//           size: 23,
//         }),
//         cell("Mức độ trẻ thực hiện", 16, {
//           bold: true,
//           center: true,
//           columnSpan: 4,
//           size: 23,
//         }),
//         cell("Đánh giá", 19, {
//           bold: true,
//           center: true,
//           rowSpan: 2,
//           size: 23,
//         }),
//       ],
//     }),
//     new TableRow({
//       tableHeader: false,
//       children: [
//         cell("T1", 4, { bold: true, center: true }),
//         cell("T2", 4, { bold: true, center: true }),
//         cell("T3", 4, { bold: true, center: true }),
//         cell("T4", 4, { bold: true, center: true }),
//         // cell("T1", 3.2, { bold: true, center: true }),
//         // cell("T2", 3.2, { bold: true, center: true }),
//         // cell("T3", 3.2, { bold: true, center: true }),
//         // cell("T4", 3.2, { bold: true, center: true }),
//         // cell("T5", 3.2, { bold: true, center: true }),
//       ],
//     }),
//   ];

//   groups.forEach((group, groupIndex) => {
//     group.items.forEach((item, itemIndex) => {
//       tableRows.push(
//         new TableRow({
//           height: { value: 520, rule: HeightRule.ATLEAST },
//           children: [
//             ...(itemIndex === 0
//               ? [
//                   cell(String(groupIndex + 1), 4, {
//                     center: true,
//                     rowSpan: group.items.length,
//                     verticalTop: true,
//                   }),
//                   cell(group.field, 11, {
//                     bold: true,
//                     center: true,
//                     rowSpan: group.items.length,
//                     verticalTop: true,
//                   }),
//                 ]
//               : []),

//             cell(`${itemIndex + 1}. ${item.target}`, 30, {
//               verticalTop: true,
//             }),

//             cell("", 20, {
//               verticalTop: true,
//             }),

//             // cell("", 3.2, { center: true }),
//             // cell("", 3.2, { center: true }),
//             // cell("", 3.2, { center: true }),
//             // cell("", 3.2, { center: true }),
//             // cell("", 3.2, { center: true }),
//             cell("", 4, { center: true }),
//             cell("", 4, { center: true }),
//             cell("", 4, { center: true }),
//             cell("", 4, { center: true }),

//             cell("", 19, { verticalTop: true }),
//           ],
//         }),
//       );
//     });
//   });

//   const headerTable = new Table({
//     width: { size: 100, type: WidthType.PERCENTAGE },
//     rows: [
//       new TableRow({
//         height: {
//           value: 1200,
//           rule: HeightRule.ATLEAST,
//         },
//         children: [
//           new TableCell({
//             width: { size: 20, type: WidthType.PERCENTAGE },
//             borders: border,
//             verticalAlign: VerticalAlign.CENTER,
//             children: [
//               new Paragraph({
//                 alignment: AlignmentType.CENTER,
//                 children: [
//                   new ImageRun({
//                     data: logoBuffer,
//                     transformation: {
//                       width: 60,
//                       height: 60,
//                     },
//                     type: "png",
//                   }),
//                 ],
//               }),
//             ],
//           }),
//           new TableCell({
//             width: { size: 85, type: WidthType.PERCENTAGE },
//             borders: border,
//             verticalAlign: VerticalAlign.CENTER,
//             children: [
//               p("TRUNG TÂM TÂM LÝ - GIÁO DỤC NGÔI SAO XANH", {
//                 bold: true,
//                 color: "008000",
//                 size: 28,
//               }),
//             ],
//           }),
//         ],
//       }),
//     ],
//   });

//   const doc = new Document({
//     sections: [
//       {
//         properties: {
//           page: {
//             size: { orientation: PageOrientation.LANDSCAPE },
//             margin: { top: 500, right: 500, bottom: 500, left: 500 },
//           },
//         },
//         children: [
//           headerTable,

//           p(`KẾ HOẠCH CAN THIỆP THÁNG ${data.title}`, {
//             bold: true,
//             center: true,
//             size: 30,
//           }),

//           p(`Thời gian: ${data.rangeTime || ""}`, {
//             italic: true,
//             center: true,
//             size: 24,
//           }),

//           new Paragraph({
//             text: "",
//             spacing: {
//               after: 12,
//             },
//           }),

//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: `Học sinh: ${data.child || ""}`,
//                 bold: true,
//                 size: 24,
//                 font: "Times New Roman",
//               }),
//               new TextRun({
//                 text: `                                          Ngày sinh: ${data.birthChild || ""}`,
//                 bold: true,
//                 size: 24,
//                 font: "Times New Roman",
//               }),
//             ],
//           }),

//           new Paragraph({
//             text: "",
//             spacing: {
//               after: 12,
//             },
//           }),

//           p(
//             "Mức độ: 0. Không thực hiện             1. Thực hiện với nhiều sự hỗ trợ             2. Thực hiện với ít sự hỗ trợ             3. Tự thực hiện",
//             {
//               italic: true,
//               size: 23,
//             },
//           ),

//           new Paragraph({ text: "" }),

//           new Table({
//             width: { size: 100, type: WidthType.PERCENTAGE },
//             rows: tableRows,
//           }),
//         ],
//       },
//     ],
//   });

//   const blob = await Packer.toBlob(doc);
//   saveAs(blob, `KH.${data.title}.${data.child || "tre"}.docx`);
// }
