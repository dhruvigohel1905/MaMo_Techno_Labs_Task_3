import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Clean string characters for safe PDF printing
 */
const safeText = (txt) => {
  if (!txt) return '';
  return txt.replace(/[^\x00-\x7F]/g, ''); // strip non-ascii characters to avoid font drawing glitches in default jsPDF
};

/**
 * Client-side PDF generator using jsPDF
 * @param {object} analysis Analysis model object
 * @param {string} fileName Document name
 */
export const exportToPDF = (analysis, fileName) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const title = `LEGAL AUDIT REPORT`;
  const subTitle = `Document: ${safeText(fileName)}`;
  const dateStr = `Generated on: ${new Date(analysis.createdAt).toLocaleDateString()}`;
  
  // Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // brand primary: #2563EB
  doc.text(title, 20, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(dateStr, 140, 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(subTitle, 20, 35);

  // Draw separation line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Overall Risk Score Callout
  doc.setFillColor(248, 250, 252);
  doc.rect(20, 45, 170, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('OVERALL CONTRACT RISK PROFILE:', 25, 57);

  const score = analysis.riskScore || 0;
  let scoreColor = [16, 185, 129]; // green
  let label = 'LOW RISK';
  if (score >= 71) {
    scoreColor = [239, 68, 68]; // red
    label = 'HIGH RISK';
  } else if (score >= 31) {
    scoreColor = [245, 158, 11]; // orange
    label = 'MEDIUM RISK';
  }

  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(14);
  doc.text(`${score}/100 (${label})`, 110, 57);

  let currentY = 75;

  // Executive Summary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('1. Executive Summary', 20, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(safeText(analysis.summary), 170);
  doc.text(summaryLines, 20, currentY);
  currentY += (summaryLines.length * 5) + 10;

  // Key Clauses Section
  checkPageOverflow(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('2. Key Clause Analysis', 20, currentY);
  currentY += 8;

  analysis.clauses.forEach((clause) => {
    checkPageOverflow(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    
    let levelLabel = `[Risk: ${clause.riskLevel}]`;
    doc.text(`${safeText(clause.type)} ${levelLabel}`, 20, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(`Audit Note: ${safeText(clause.description)}`, 170);
    doc.text(descLines, 20, currentY);
    currentY += (descLines.length * 4.5) + 4;

    if (clause.snippet) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const snippetLines = doc.splitTextToSize(`Snippet: "${safeText(clause.snippet)}"`, 160);
      doc.text(snippetLines, 25, currentY);
      currentY += (snippetLines.length * 4) + 6;
    }
  });

  currentY += 5;

  // Risks Section
  checkPageOverflow(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('3. Detected Risks & Red Flags', 20, currentY);
  currentY += 8;

  analysis.risks.forEach((risk) => {
    checkPageOverflow(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(239, 68, 68); // Red-ish
    doc.text(`[${risk.riskLevel} Risk] ${safeText(risk.title)}`, 20, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const riskDesc = doc.splitTextToSize(safeText(risk.description), 170);
    doc.text(riskDesc, 20, currentY);
    currentY += (riskDesc.length * 4.5) + 6;
  });

  currentY += 5;

  // Recommendations Section
  checkPageOverflow(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('4. Legal Recommendations', 20, currentY);
  currentY += 8;

  analysis.recommendations.forEach((rec, idx) => {
    checkPageOverflow(15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const recText = doc.splitTextToSize(`${idx + 1}. ${safeText(rec)}`, 170);
    doc.text(recText, 20, currentY);
    currentY += (recText.length * 4.5) + 3;
  });

  // Helper check for page layout overflow
  function checkPageOverflow(spaceNeeded) {
    if (currentY + spaceNeeded > 280) {
      doc.addPage();
      currentY = 20; // reset margin top
    }
  }

  // Save the PDF
  const cleanName = fileName.replace(/\.[^/.]+$/, "");
  doc.save(`lexiguard_report_${cleanName}.pdf`);
};

/**
 * Client-side DOCX generator using docx package
 * @param {object} analysis Analysis model object
 * @param {string} fileName Document name
 */
export const exportToDOCX = async (analysis, fileName) => {
  const score = analysis.riskScore || 0;
  let label = 'Low Risk';
  if (score >= 71) label = 'High Risk';
  else if (score >= 31) label = 'Medium Risk';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'LEGAL AUDIT REPORT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          // Metadata Details
          new Paragraph({
            children: [
              new TextRun({ text: `Source File: `, bold: true }),
              new TextRun(fileName),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Generated: `, bold: true }),
              new TextRun(new Date(analysis.createdAt).toLocaleDateString()),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Contract Risk Profile: `, bold: true }),
              new TextRun({ text: `${score}/100 - ${label}`, bold: true, color: '2563EB' }),
            ],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }), // space

          // 1. Executive Summary
          new Paragraph({
            text: '1. Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: analysis.summary,
            spacing: { after: 200 },
          }),

          // 2. Key Clause breakdown
          new Paragraph({
            text: '2. Key Clause breakdown',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          ...analysis.clauses.map(clause => {
            return [
              new Paragraph({
                children: [
                  new TextRun({ text: `${clause.type} (Severity: ${clause.riskLevel})`, bold: true }),
                ],
                spacing: { before: 120, after: 60 },
              }),
              new Paragraph({
                text: `Audit Note: ${clause.description}`,
              }),
              clause.snippet ? new Paragraph({
                text: `Excerpt: "${clause.snippet}"`,
                italics: true,
                spacing: { after: 120 },
              }) : new Paragraph({ text: '' }),
            ];
          }).flat(),

          // 3. Risks & Red Flags
          new Paragraph({
            text: '3. Detected Risks & Red Flags',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          ...analysis.risks.map(risk => {
            return [
              new Paragraph({
                children: [
                  new TextRun({ text: `[${risk.riskLevel} Severity] ${risk.title}`, bold: true, color: 'EF4444' }),
                ],
                spacing: { before: 100, after: 40 },
              }),
              new Paragraph({
                text: risk.description,
                spacing: { after: 100 },
              }),
            ];
          }).flat(),

          // 4. Action Recommendations
          new Paragraph({
            text: '4. Legal Recommendations',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          ...analysis.recommendations.map((rec, idx) => {
            return new Paragraph({
              text: `${idx + 1}. ${rec}`,
              spacing: { after: 100 },
            });
          }),
        ],
      },
    ],
  });

  // Generate Blob and trigger download
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  const cleanName = fileName.replace(/\.[^/.]+$/, "");
  a.download = `lexiguard_report_${cleanName}.docx`;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
