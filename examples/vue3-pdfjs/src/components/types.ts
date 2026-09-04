import type { PDFPageView } from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';

export type PageView = PDFPageView;

export interface HighlightData {
  bbox: [number, number, number, number];
  pageNo: number;
  pageSize: [number, number];
}

export type HighlightsList = HighlightData[];

export interface PageRenderedEvent {
  cssTransform: boolean;
  isDetailView: boolean;
  source: PDFPageView;
  pageNumber: number;
  timestamp: number;
}

interface ActivePage {
  pageNo: number;
  container: HTMLElement;
  highlights: HighlightData[];
}

export type ActivePageHighlights = ActivePage[];
