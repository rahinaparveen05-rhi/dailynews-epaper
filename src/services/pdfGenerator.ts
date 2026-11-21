import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NewspaperEdition } from '../types/newspaper';

/**
 * Converts text into WinAnsi-safe characters supported by PDF StandardFonts
 * so characters like ₹ never cause pdf-lib encoding errors.
 */
function toWinAnsiSafe(text: string): string {
  return text
    .replace(/₹\s*/g, 'Rs. ')
    .replace(/[—]/g, '--')
    .replace(/[–]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

function wrapText(text: string, maxChars: number): string[] {
  const safe = toWinAnsiSafe(text);
  const words = safe.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates an authentic multi-page broadsheet PDF using pdf-lib
 * so users can view real PDF pages or download editions for offline reading.
 */
export async function generateEditionPdfBytes(edition: NewspaperEdition): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const serifRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const sansRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const inkBlack = rgb(0.04, 0.04, 0.04);
  const crimson = rgb(0.72, 0.11, 0.11);
  const mutedGray = rgb(0.35, 0.35, 0.35);
  const ruleGray = rgb(0.82, 0.82, 0.82);

  for (const pageData of edition.pages) {
    const page = pdfDoc.addPage([612, 842]);
    const { width, height } = page.getSize();
    const margin = 42;
    let cursorY = height - 42;

    if (pageData.pageNumber === 1) {
      page.drawText('DailyNews', {
        x: margin,
        y: cursorY - 26,
        size: 32,
        font: serifBold,
        color: inkBlack,
      });

      page.drawText(toWinAnsiSafe(`${edition.formattedDate}  |  ${edition.cityEdition}`), {
        x: width - margin - 220,
        y: cursorY - 18,
        size: 9,
        font: sansRegular,
        color: mutedGray,
      });

      cursorY -= 40;
      page.drawLine({
        start: { x: margin, y: cursorY },
        end: { x: width - margin, y: cursorY },
        thickness: 1.5,
        color: inkBlack,
      });
      cursorY -= 3;
      page.drawLine({
        start: { x: margin, y: cursorY },
        end: { x: width - margin, y: cursorY },
        thickness: 0.75,
        color: crimson,
      });
      cursorY -= 20;
    } else {
      page.drawText(toWinAnsiSafe(`DailyNews  --  ${pageData.section.toUpperCase()}`), {
        x: margin,
        y: cursorY,
        size: 10,
        font: sansBold,
        color: crimson,
      });
      page.drawText(toWinAnsiSafe(`${edition.formattedDate}  ·  Page ${pageData.pageNumber}`), {
        x: width - margin - 160,
        y: cursorY,
        size: 9,
        font: sansRegular,
        color: mutedGray,
      });
      cursorY -= 10;
      page.drawLine({
        start: { x: margin, y: cursorY },
        end: { x: width - margin, y: cursorY },
        thickness: 0.8,
        color: inkBlack,
      });
      cursorY -= 22;
    }

    page.drawText(toWinAnsiSafe(pageData.pageTitle), {
      x: margin,
      y: cursorY,
      size: 11,
      font: sansBold,
      color: crimson,
    });
    cursorY -= 20;

    for (const article of pageData.articles) {
      if (cursorY < 130) break;

      const headlineLines = wrapText(article.headline, 54);
      for (const hLine of headlineLines) {
        page.drawText(hLine, {
          x: margin,
          y: cursorY,
          size: article.isLead ? 19 : 14,
          font: serifBold,
          color: inkBlack,
        });
        cursorY -= article.isLead ? 23 : 18;
      }

      page.drawText(toWinAnsiSafe(`${article.byline}  ·  ${article.location}`), {
        x: margin,
        y: cursorY,
        size: 8.5,
        font: sansBold,
        color: mutedGray,
      });
      cursorY -= 14;

      const deckLines = wrapText(article.deck, 86);
      for (const dLine of deckLines) {
        page.drawText(dLine, {
          x: margin,
          y: cursorY,
          size: 10,
          font: serifBold,
          color: rgb(0.2, 0.2, 0.2),
        });
        cursorY -= 13;
      }
      cursorY -= 4;

      for (const paragraph of article.paragraphs) {
        const bodyLines = wrapText(paragraph, 92);
        for (const bLine of bodyLines) {
          if (cursorY < 72) break;
          page.drawText(bLine, {
            x: margin,
            y: cursorY,
            size: 9.5,
            font: serifRegular,
            color: inkBlack,
          });
          cursorY -= 12.5;
        }
        cursorY -= 5;
      }

      cursorY -= 8;
      page.drawLine({
        start: { x: margin, y: cursorY },
        end: { x: width - margin, y: cursorY },
        thickness: 0.5,
        color: ruleGray,
      });
      cursorY -= 18;
    }

    page.drawLine({
      start: { x: margin, y: 44 },
      end: { x: width - margin, y: 44 },
      thickness: 0.5,
      color: ruleGray,
    });
    page.drawText(toWinAnsiSafe(`DailyNews ePaper  ·  ${edition.volumeLabel}`), {
      x: margin,
      y: 30,
      size: 8,
      font: sansRegular,
      color: mutedGray,
    });
    page.drawText(`Page ${pageData.pageNumber} of ${edition.totalPages}`, {
      x: width - margin - 62,
      y: 30,
      size: 8,
      font: sansBold,
      color: inkBlack,
    });
  }

  return await pdfDoc.save();
}

export async function downloadEditionPdfFile(
  edition: NewspaperEdition,
): Promise<{ sizeLabel: string }> {
  const bytes = await generateEditionPdfBytes(edition);
  const exactBytes = new Uint8Array(bytes);
  const blob = new Blob([exactBytes], { type: 'application/pdf' });
  const sizeKb = Math.max(1, Math.round(exactBytes.byteLength / 1024));
  const sizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `DailyNews_${edition.isoDate}.pdf`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);

  return { sizeLabel };
}
