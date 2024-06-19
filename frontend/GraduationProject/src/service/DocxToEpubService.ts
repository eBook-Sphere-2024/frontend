import { Injectable } from "@angular/core";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as mammoth from "mammoth";
import { DOMParser } from "@xmldom/xmldom";

@Injectable({
    providedIn: "root",
})
export class DocxToEpubService {
    async convertDocxToEpub(docxBlob: Blob, epubName: string): Promise<void> {
        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(docxBlob);
            const htmlContent = await this.transformDocxToHtml(arrayBuffer);
            this.convertHtmlToEpub(htmlContent, epubName);
        } catch (error) {
            console.error("Error during DOCX to EPUB conversion:", error);
        }
    }

    private readFileAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    private async transformDocxToHtml(
        arrayBuffer: ArrayBuffer
    ): Promise<string> {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value; // The generated HTML
        const messages = result.messages; // Any messages, such as warnings during conversion
        console.log(messages);
        return html;
    }

    private convertHtmlToEpub(htmlContent: string, epubName: string): void {
        const zip = new JSZip();

        // Define EPUB structure
        zip.file("mimetype", "application/epub+zip");
        const metaInf = zip.folder("META-INF");
        metaInf?.file(
            "container.xml",
            `
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
          <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
      </container>
    `
        );

        const oebps = zip.folder("OEBPS");
        oebps?.file("content.opf", this.createOpfFile());
        oebps?.file("toc.ncx", this.createNcxFile());
        oebps?.file("content.xhtml", this.createXhtmlFile(htmlContent));

        // Generate the EPUB file
        // Save the EPUB file
        let saveBeforeReturn = zip.generateAsync({ type: "blob" });
        saveBeforeReturn.then((blob) => {
            saveAs(blob, epubName + ".epub");
        });
    }

    private createOpfFile(): string {
        return `
      <?xml version="1.0" encoding="UTF-8"?>
      <package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="bookid">
        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:title>Sample Book</dc:title>
          <dc:creator>Author</dc:creator>
          <dc:language>en</dc:language>
          <dc:identifier id="bookid">urn:uuid:12345</dc:identifier>
        </metadata>
        <manifest>
          <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
          <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        </manifest>
        <spine toc="ncx">
          <itemref idref="content"/>
        </spine>
      </package>
    `;
    }

    private createNcxFile(): string {
        return `
      <?xml version="1.0" encoding="UTF-8"?>
      <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <head>
          <meta name="dtb:uid" content="urn:uuid:12345"/>
          <meta name="dtb:depth" content="1"/>
          <meta name="dtb:totalPageCount" content="0"/>
          <meta name="dtb:maxPageNumber" content="0"/>
        </head>
        <docTitle>
          <text>Sample Book</text>
        </docTitle>
        <navMap>
          <navPoint id="navpoint-1" playOrder="1">
            <navLabel>
              <text>Start</text>
            </navLabel>
            <content src="content.xhtml"/>
          </navPoint>
        </navMap>
      </ncx>
    `;
    }

    private createXhtmlFile(htmlContent: string): string {
        return `
      <?xml version="1.0" encoding="UTF-8"?>
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <title>Sample Book</title>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    }
}
