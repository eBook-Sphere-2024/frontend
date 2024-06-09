import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DocumentEditorContainerComponent, ImageFormat, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { PdfBitmap, PdfDocument, PdfPageOrientation, PdfPageSettings, PdfSection, SizeF } from '@syncfusion/ej2-pdf-export';
import '@syncfusion/ej2-pdf-export';
import { EventService } from '../../../shared/services/EventService';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [ToolbarService]
})
export class EditorComponent implements OnInit {

  @ViewChild('documentEditor', { static: true }) editorObj!: DocumentEditorContainerComponent;
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;
  isOpenEbook: boolean = false
  constructor() { }

  ngOnInit(): void {
  }
  createEbook() {

  }
  public onFileOpenClick(): void {
    // Open file picker.
    (document.getElementById('open_sfdt') as HTMLElement).click();

  }

  public onFileChange(e: any): void {

    if (e.target.files[0]) {
      // Get the selected file.
      let file = e.target.files[0];
      if (file.name.substr(file.name.lastIndexOf('.')) === '.sfdt') {
        let fileReader: FileReader = new FileReader();
        fileReader.onload = (e: any) => {
          let contents: string = e.target.result;
          this.isOpenEbook = true;
          // Open the sfdt document in Document Editor.
          this.editorObj.documentEditor.open(contents);

        };
        this.isOpenEbook = true;
        console.log(this.isOpenEbook)
        // Read the input file.
        fileReader.readAsText(file);
        this.editorObj.documentEditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
      }
    }

  }

  onCreated() {
    this.editorObj.documentEditor.spellChecker.languageID = 1033;
    this.editorObj.documentEditor.spellChecker.removeUnderline = false;
    this.editorObj.documentEditor.spellChecker.allowSpellCheckAndSuggestion = true;
    this.editorObj.documentEditor.spellChecker.enableOptimizedSpellCheck = true;
  }

  public onSave() {
    const fileName = 'sampleDocument';
    this.editorObj.documentEditor.save(fileName, 'Sfdt');
  }

  public onExportAsPDF() {
    const pdfDocument: PdfDocument = new PdfDocument();
    const pageCount: number = this.editorObj.documentEditor.pageCount;
    this.editorObj.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
    let loadedPages = 0;

    for (let i = 1; i <= pageCount; i++) {
      setTimeout(() => {
        const format: ImageFormat = 'image/jpeg' as ImageFormat;
        const image = this.editorObj.documentEditor.exportAsImage(i, format);

        image.onload = () => {
          const imageHeight = parseInt(image.style.height.replace('px', ''), 10);
          const imageWidth = parseInt(image.style.width.replace('px', ''), 10);
          const section: PdfSection = pdfDocument.sections.add() as PdfSection;
          const settings: PdfPageSettings = new PdfPageSettings();

          if (imageWidth > imageHeight) {
            settings.orientation = PdfPageOrientation.Landscape;
          }
          settings.size = new SizeF(imageWidth, imageHeight);
          section.setPageSettings(settings);

          const page = section.pages.add();
          const graphics = page.graphics;
          const imageStr = image.src.replace('data:image/jpeg;base64,', '');
          const pdfImage = new PdfBitmap(imageStr);
          graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);

          loadedPages++;
          if (loadedPages === pageCount) {
            pdfDocument.save(this.editorObj.documentEditor.documentName || 'sample.pdf');
          }
        };
      }, 500);
    }
  }

  public onPrint() {
    this.editorObj.documentEditor.print();
  }

  public items: ItemModel[] = [
    {
      text: 'Docx',
      id: 'docx',
    },
    {
      text: 'TXT',
      id: 'TXT',
    },
    {
      text: 'PDF',
      id: 'PDF'
    }
  ];

  // Method to handle item click event
  onExportItemClick(event: any): void {
    console.log(event.item.properties.id);
    if (event.item.properties.id === 'docx') {
      this.editorObj.documentEditor.save('sample.docx', 'Docx');
    } else if (event.item.properties.id === 'TXT') {
      this.editorObj.documentEditor.save('sample.txt', 'Txt');
    } else if (event.item.properties.id === 'PDF') {
      this.onExportAsPDF();
    }
  }

  public itemBeforeEvent(args: MenuEventArgs) {
    args.element.style.height = '105px';
  }
}
