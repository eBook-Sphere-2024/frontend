import { Component, ViewChild } from "@angular/core";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-angular-documenteditor";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";

import { MenuEventArgs } from "@syncfusion/ej2-navigations";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "GraduationProject";

    @ViewChild("documentEditor", { static: false })
    editorObj!: DocumentEditorContainerComponent;

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
    public onSaveAsPdf() {
        //i only have print method in document editor to covert the document to pdf but i need to save it as pdf dircetly without print
        this.editorObj.documentEditor.print();
    }

    public items: ItemModel[] = [
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
        }
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
}
