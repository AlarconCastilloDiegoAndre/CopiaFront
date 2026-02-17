import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface EnrollmentForPDF {
  enrollmentId: string;
  subjectName: string;
  type: string;
}

interface SummaryForPDF {
  total: number;
  normal: number;
  adelanto: number;
  recursamiento: number;
}

interface GenerateEnrollmentPDFParams {
  studentName: string;
  studentId?: number;
  careerName?: string;
  semester?: number;
  groupNo?: number;
  periodId: string;
  enrollments: EnrollmentForPDF[];
  summary?: SummaryForPDF;
}

export async function generateEnrollmentPDF({
  studentName,
  studentId,
  careerName,
  semester,
  groupNo,
  periodId,
  enrollments,
  summary,
}: GenerateEnrollmentPDFParams): Promise<void> {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Márgenes más compactos para que quepa todo en una hoja
  const margin = 16;

  // Reservas de footer (para que nada lo invada)
  const footerReserve = 22; // espacio mínimo para línea + textos
  const contentBottomLimit = pageHeight - footerReserve;

  let yPos = 14;

  // Colores
  const primaryColor: [number, number, number] = [0, 61, 107]; // #003d6b
  const grayColor: [number, number, number] = [100, 100, 100];

  // ========== HEADER (más bajo) ==========
  const headerH = 32;
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, headerH, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("UNIVERSIDAD AUTÓNOMA DE QUERÉTARO", pageWidth / 2, 13, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("FACULTAD DE INFORMÁTICA", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text("Comprobante de Pre-inscripción", pageWidth / 2, 27, {
    align: "center",
  });

  yPos = headerH + 12;

  // ========== INFORMACIÓN DEL ESTUDIANTE (compacto) ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL ESTUDIANTE", margin, yPos);

  yPos += 6;

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  const col1X = margin;
  const col2X = pageWidth / 2 + 6;

  // Fila 1
  doc.text("Nombre:", col1X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(studentName || "N/A", col1X + 22, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Expediente:", col2X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(studentId?.toString() || "N/A", col2X + 28, yPos);

  yPos += 6;

  // Fila 2
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Carrera:", col1X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(careerName || "N/A", col1X + 22, yPos);

  yPos += 6;

  // Fila 3
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Semestre:", col1X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(semester?.toString() || "N/A", col1X + 22, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Grupo:", col2X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(groupNo?.toString() || "N/A", col2X + 16, yPos);

  yPos += 6;

  // Fila 4
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Periodo:", col1X, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(periodId || "N/A", col1X + 22, yPos);

  yPos += 12;

  // ========== TABLA DE MATERIAS ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("MATERIAS INSCRITAS", margin, yPos);

  yPos += 4;

  const tableData = enrollments.map((e, index) => {
    let tipoLabel = e.type;
    if (e.type === "NORMAL") tipoLabel = "Normal";
    else if (e.type === "ADELANTO") tipoLabel = "Adelanto";
    else if (e.type === "RECURSAMIENTO") tipoLabel = "Recursamiento";

    return [(index + 1).toString(), e.subjectName, tipoLabel];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["#", "NOMBRE DE LA MATERIA", "TIPO"]],
    body: tableData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,     
      cellPadding: 2,  
      valign: "middle",
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      cellPadding: 2,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left" },
      2: { halign: "center", cellWidth: 30 },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    pageBreak: "avoid",
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 8;

  // ========== RESUMEN (compacto) ==========
  if (summary) {
    const boxH = 30; // más bajo
    const boxW = pageWidth - margin * 2;
    const boxX = margin;

    // Ajustar si se sale del límite inferior
    if (yPos + boxH > contentBottomLimit - 2) {
      yPos = contentBottomLimit - boxH - 2;
    }

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(boxX, yPos, boxW, boxH, 3, 3, "F");

    const colW = boxW / 4;
    const labelY = yPos + 10;
    const valueY = yPos + 23;

    // separadores
    doc.setDrawColor(220, 224, 230);
    doc.setLineWidth(0.2);
    for (let k = 1; k <= 3; k++) {
      const x = boxX + colW * k;
      doc.line(x, yPos + 5, x, yPos + boxH - 5);
    }

    const drawMetric = (
      colIndex: number,
      label: string,
      value: number,
      color: [number, number, number]
    ) => {
      const cx = boxX + colW * (colIndex + 0.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...color);
      doc.text(label, cx, labelY, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...color);
      doc.text(String(value), cx, valueY, { align: "center" });
    };

    drawMetric(0, "Total", summary.total, [0, 0, 0]);
    drawMetric(1, "Normales", summary.normal, [16, 185, 129]);
    drawMetric(2, "Adelanto", summary.adelanto, [59, 130, 246]);
    drawMetric(3, "Recursamiento", summary.recursamiento, [245, 158, 11]);

    yPos += boxH + 6;
  }

  // ========== FOOTER (más compacto y consistente) ==========
  const footerY = pageHeight - 14;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  const fechaGeneracion = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.text(`Documento generado el: ${fechaGeneracion}`, margin, footerY);
  doc.text(
    "Sistema de Pre-inscripciones - Facultad de Informática UAQ",
    pageWidth - margin,
    footerY,
    { align: "right" }
  );

  // ========== GUARDAR ==========
  const fileName = `comprobante_preinscripcion_${studentId || "estudiante"}_${periodId || "periodo"}.pdf`;
  doc.save(fileName);
}
