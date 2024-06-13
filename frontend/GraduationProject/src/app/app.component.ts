import { Component, OnInit, ViewChild } from "@angular/core";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import {
    DocumentEditorContainerComponent,
    ImageFormat,
    CustomToolbarItemModel,
} from "@syncfusion/ej2-angular-documenteditor";
import {
    PdfBitmap,
    PdfDocument,
    PdfPageOrientation,
    PdfPageSettings,
    PdfSection,
    SizeF,
} from "@syncfusion/ej2-pdf-export";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { MenuEventArgs } from "@syncfusion/ej2-navigations";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    ngOnInit(): void {}
    title = "GraduationProject";

    @ViewChild("documentEditor", { static: false })
    editorObj!: DocumentEditorContainerComponent;

    //Custom toolbat item.
    /*
    public toolItem: CustomToolbarItemModel = {
        prefixIcon: "e-de-ctnr-lock",
        tooltipText: "Disable Image",
        text: "Disable Image",
        id: "Custom",
    };
    public toolbarItems = [
        "New",
        "Open",
        "Separator",
        "Undo",
        "Redo",
        "Separator",
        "Image",
        "Table",
        "Hyperlink",
        "Bookmark",
        "TableOfContents",
        "Separator",
        "Header",
        "Footer",
        "PageSetup",
        "PageNumber",
        "Break",
        "Separator",
        "Find",
        "Separator",
        "Comments",
        "TrackChanges",
        "Separator",
        "LocalClipboard",
        "RestrictEditing",
        "Separator",
        "FormFields",
        "UpdateFields",
        "ContentControl",
    ];
    public onToolbarClick(args: ClickEventArgs): void {
        switch (args.item.id) {
            case "Custom":
                //Disable image toolbar item.
                this.editorObj.toolbar.enableItems(4, false);
                break;
        }
    }
*/
    public onSaveDocx() {
        this.editorObj.documentEditor.save("sampleDocument", "Docx");
    }
    public onSaveDotx() {
        this.editorObj.documentEditor.save("sampleDocument", "Dotx");
    }
    public onSaveSfdt() {
        this.editorObj.documentEditor.save("sampleDocument", "Sfdt");
    }
    public onSaveTxt() {
        this.editorObj.documentEditor.save("sampleDocument", "Txt");
    }
    public onPrint() {
        this.editorObj.documentEditor.print();
    }

    public ExportItems: ItemModel[] = [
        {
            text: "Syncfusion Document Text (*.sfdt)",
            id: "sfdt",
        },
        {
            text: "Word Document (*.docx)",
            id: "docx",
        },
        {
            text: "Word Template (*.dotx)",
            id: "dotx",
        },
        {
            text: "Text (*.txt)",
            id: "txt",
        },
        {
            text: "Pdf (*.pdf)",
            id: "pdf",
        },
    ];

    public onSelected(event: any): void {
        const menuEvent: MenuEventArgs = event as MenuEventArgs;
        switch (event.item.id) {
            case "sfdt":
                this.onSaveSfdt();
                break;
            case "docx":
                this.onSaveDocx();
                break;
            case "dotx":
                this.onSaveDotx();
                break;
            case "txt":
                this.onSaveTxt();
                break;
            case "pdf":
                this.onSaveAsPdf();
                break;
        }
    }

    public itemBeforeEvent(args: MenuEventArgs) {
        args.element.style.height = "105px";
    }

    onSaveAsPdf(): void {
        let obj = this;
        let pdfdocument: PdfDocument = new PdfDocument();
        let count: number = obj.editorObj.documentEditor.pageCount;
        obj.editorObj.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
        let loadedPage = 0;
        for (let i = 1; i <= count; i++) {
            setTimeout(() => {
                let format: ImageFormat = "image/jpeg" as ImageFormat;
                // Getting pages as image
                let image = obj.editorObj.documentEditor.exportAsImage(
                    i,
                    format
                );
                image.onload = function () {
                    let imageHeight = parseInt(
                        image.style.height.toString().replace("px", "")
                    );
                    let imageWidth = parseInt(
                        image.style.width.toString().replace("px", "")
                    );
                    let section: PdfSection =
                        pdfdocument.sections.add() as PdfSection;
                    let settings: PdfPageSettings = new PdfPageSettings(0);
                    if (imageWidth > imageHeight) {
                        settings.orientation = PdfPageOrientation.Landscape;
                    }
                    settings.size = new SizeF(imageWidth, imageHeight);
                    (section as PdfSection).setPageSettings(settings);
                    let page = section.pages.add();
                    let graphics = page.graphics;
                    let imageStr = image.src.replace(
                        "data:image/jpeg;base64,",
                        ""
                    );
                    let pdfImage = new PdfBitmap(imageStr);
                    graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
                    loadedPage++;
                    if (loadedPage == count) {
                        // Exporting the document as pdf
                        pdfdocument.save(
                            (obj.editorObj.documentEditor.documentName === ""
                                ? "sample"
                                : obj.editorObj.documentEditor.documentName) +
                                ".pdf"
                        );
                    }
                };
            }, 500);
        }
    }
}
