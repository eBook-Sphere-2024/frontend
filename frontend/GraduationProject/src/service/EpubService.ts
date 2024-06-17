import { Injectable } from "@angular/core";
import JSZip from "jszip";
import { saveAs } from "file-saver";

@Injectable({
    providedIn: "root",
})
export class EpubService {
    constructor() {}

    async convertTxtToEpub(
        txtContent: string,
        title: string = "Sample Book",
        author: string = "Unknown Author"
    ): Promise<Blob> {
        const zip = new JSZip();

        // Add mimetype file
        zip.file("mimetype", "application/epub+zip");

        // Add META-INF/container.xml
        const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
        zip.folder("META-INF")?.file("container.xml", containerXml);

        // Add content.opf
        const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid">urn:uuid:12345</dc:identifier>
    <dc:creator>${author}</dc:creator>
  </metadata>
  <manifest>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="content"/>
  </spine>
</package>`;
        zip.folder("OEBPS")?.file("content.opf", contentOpf);

        // Add content.xhtml
        const contentXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${title}</title>
</head>
<body>
  <pre>${txtContent}</pre>
</body>
</html>`;
        zip.folder("OEBPS")?.file("content.xhtml", contentXhtml);

        // Generate the EPUB file
        // Generate the EPUB file
        const epubBlob = await zip.generateAsync({ type: "blob" });
        saveAs(epubBlob, "book.epub");
        return epubBlob;
    }
}
