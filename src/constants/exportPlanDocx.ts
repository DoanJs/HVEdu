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
  intervention: string;
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
    justify?: boolean;
    size?: number;
    color?: string;
  },
) =>
  new Paragraph({
    alignment: options?.justify ? AlignmentType.JUSTIFIED :
      options?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
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
    justify?: boolean;
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
        justify: options?.justify,
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
        cell("STT", 4, { bold: true, center: true, size: 23 }),
        cell("Lĩnh\nvực", 11, {
          bold: true,
          center: true,
          size: 23,
        }),
        cell("Mục tiêu", 30, {
          bold: true,
          center: true,
          size: 23,
        }),
        cell("Mức độ hỗ trợ", 20, {
          bold: true,
          center: true,
          size: 23,
        }),
        cell("Nội dung", 19, {
          bold: true,
          center: true,
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

            cell(`${itemIndex + 1}. ${item.target}`, 35, {
              verticalTop: true,
              justify: true,
            }),

            cell(item.intervention || "", 10, {
              verticalTop: true,
            }),

            cell(item.content || "", 35, {
              verticalTop: true,
              justify: true,
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
                color: "0058B0",
                size: 28,
              }),
            ],
          }),
        ],
      }),
    ],
  });

   const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE},
      left: { style: BorderStyle.NONE},
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        // height: {
        //   value: 1200,
        //   rule: HeightRule.ATLEAST,
        // },
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              p(`Giám đốc`, {
            center: true,
            size: 24,
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 300,
            },
          }),
          
          new Paragraph({
            text: "",
            spacing: {
              after: 300,
            },
          }),
           p(`Nguyễn Yến Linh`, {
            center: true,
            size: 24,
          }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              p("Giáo viên can thiệp", {
            center: true,
                size: 24,
              }),
              new Paragraph({
            text: "",
            spacing: {
              after: 300,
            },
          }),
          
          new Paragraph({
            text: "",
            spacing: {
              after: 300,
            },
          }),
 p(data.teacher || 'GV', {
            center: true,
                size: 24,
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
            size: { orientation: PageOrientation.PORTRAIT },
            margin: { top: 500, right: 500, bottom: 500, left: 500 },
          },
        },
        children: [
           p("TRUNG TÂM HỖ TRỢ PHÁT TRIỂN GIÁO DỤC VÀ HOÀ NHẬP\nHY VỌNG", {
                bold: true,
                color: "0058B0",
                size: 28,
                center: true,
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: logoBuffer,
                    transformation: {
                      width: 120,
                      height: 120,
                    },
                    type: "png",
                  }),
                ],
              }), 
               new Paragraph({
            text: "",
            spacing: {
              after: 6,
            },
          }),

          p(`KẾ HOẠCH CAN THIỆP THÁNG ${data.title}`, {
            bold: true,
            center: true,
            size: 30,
            color: "0058B0",
          }),
          new Paragraph({
            text: "",
            spacing: {
              after: 6,
            },
          }),

          p(`Bé: ${data.child || "tre"}`, {
            bold: true,
            center: true,
            size: 24,
          }),

          new Paragraph({
            text: "",
            spacing: {
              after: 100,
            },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
          new Paragraph({
            text: "",
            spacing: {
              after: 100,
            },
          }),

footerTable

        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `KH.${data.title}.${data.child || "tre"}.docx`);
}