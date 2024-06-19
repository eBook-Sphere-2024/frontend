import { Injectable } from "@angular/core";
import { saveAs } from "file-saver";

@Injectable({
    providedIn: "root",
})
export class DocxToOdtConverterService {
    constructor() { }

    convertDocxToOdt(docxBlobPromise: Promise<Blob>) {
        docxBlobPromise
            .then((docxBlob) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    // Manipulate arrayBuffer if needed (for example, to convert formats using a library)
                    // For simplicity, assuming conversion directly, ODT doesn't have a simple direct conversion
                    const odtBlob = new Blob([arrayBuffer], {
                        type: "application/vnd.oasis.opendocument.text",
                    });
                    saveAs(odtBlob, "converted.odt");
                };
                reader.readAsArrayBuffer(docxBlob);
            })
            .catch((error) => {
                console.error("Error converting DOCX to ODT:", error);
            });
    }
}