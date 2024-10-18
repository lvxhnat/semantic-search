import * as S from "./style";
import * as React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface PDFViewerProps {
  file: File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = React.useState<number>();
  const [containerWidth, setContainerWidth] = React.useState<number>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function updateContainerWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    // Initial measurement
    updateContainerWidth();

    // Update on window resize
    window.addEventListener("resize", updateContainerWidth);
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <S.PDFViewerWrapper id="pdf-viewer-wrapper" ref={containerRef}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth}
          />
        ))}
      </Document>
    </S.PDFViewerWrapper>
  );
}
