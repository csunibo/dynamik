import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"

export const SCALE = 3;

export interface Box {
  x: number
  y: number
  height: number
  width: number
}

export interface Page extends Box {
  pdf: PDFPageProxy
  viewport: PageViewport
}

export const getPages = async (pdf: PDFDocumentProxy): Promise<Page[]> => {
  const pages = []
  let y = 0;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    // rendering onto the temporary canvas
    const viewport = page.getViewport({ scale: SCALE });
    pages.push({
      pdf: page,
      viewport: viewport,
      x: viewport.offsetX,
      y: y,
      height: viewport.height,
      width: viewport.width,
    })
    y += viewport.height
  }
  return pages;
}

export interface FullPDF {
  pdf: PDFDocumentProxy
  canvas: HTMLCanvasElement
  pages: Page[]
  width: number
  height: number
}

export const extractFullPDF = async (canvas: HTMLCanvasElement, pdf: PDFDocumentProxy): Promise<FullPDF> => {
  const fullCtx = canvas.getContext('2d')!;
  const result: FullPDF = {
    pdf,
    canvas,
    pages: [],
    width: 0,
    height: 0
  }

  result.pages = await getPages(pdf)
  result.width = canvas.width = Math.max(...result.pages.map(page => page.width));
  result.height = canvas.height = result.pages.reduce((acc, page) => acc + page.height, 0)

  const pageCanvas = document.createElement('canvas');
  const pageCtx = pageCanvas.getContext('2d')!;
  for (const page of result.pages) {
    pageCanvas.height = page.height
    pageCanvas.width = page.width
    await page.pdf.render({
      canvasContext: pageCtx,
      viewport: page.viewport,
    }).promise;

    // copying it over to the full canvas
    fullCtx.drawImage(pageCanvas, 0, page.y);

    // cleanup
    pageCtx.clearRect(0, 0, page.width, page.height);
    pageCanvas.width = 0;
    pageCanvas.height = 0;
  }
  pageCanvas.remove()
  return result
}

export const renderBox = (pdf: FullPDF, canvas: HTMLCanvasElement, box: Box) => {
  canvas.height = box.height;
  canvas.width = box.width;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(pdf.canvas, 0, -box.y);
}
