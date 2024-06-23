import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { DocumentEditorContainerComponent, ImageFormat, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { PdfBitmap, PdfDocument, PdfPageOrientation, PdfPageSettings, PdfSection, SizeF } from '@syncfusion/ej2-pdf-export';
import '@syncfusion/ej2-pdf-export';
import { EventService } from '../../../shared/services/EventService';
import { Router } from '@angular/router';
import { Template } from '../../../shared/models/Template';
import { EbookMakerService } from '../ebook-maker.service';
import { EBookService } from '../../reading-section/e-book/e-book.service';
import { Category } from '../../../shared/models/Category';
import { User } from '../../../shared/models/User';
import { UserServices } from '../../User/user.service';
import { DocxToOdtConverterService } from "../../../shared/services/DocxToOdtConverterService";
import { DocxToEpubService } from "../../../shared/services/DocxToEpubService";
import jsPDF from 'jspdf';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [ToolbarService]
})
export class EditorComponent implements OnInit {

  @ViewChild('documentEditor', { static: true }) editorObj!: DocumentEditorContainerComponent;
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;
  @ViewChild('categoryDialog') categoryDialog!: ElementRef<HTMLDialogElement>;
  categories: Category[] = [];
  isOpenEbook: boolean = false;
  template!: Template;
  content !: string;
  fileHandle: any;
  dirHandle: any;
  opened: boolean = false;
  ebookTitle: string = '';
  description: string = '';
  userProfile!: User;
  selectedCategories: Category[] = [];
  previousUrl: string = '';
  ebooksavedTitle: string = '';
  alertMessage: string = '';
  showDialog: boolean = false; // Control variable for showing the dialog
  private docBlobTemp: Promise<Blob> = Promise.resolve(new Blob());

  constructor(private docxToEpubService: DocxToEpubService, private converterService: DocxToOdtConverterService, private locationStrategy: LocationStrategy, private userService: UserServices, private ebookService: EBookService, private router: Router, private events: EventService, private ebookMakerService: EbookMakerService) {
    events.listen('editTemplate', (data: any) => {
      this.template = data;
      this.Opentemplate();
    })
    this.events.listen('openEditor', (_data: any) => {
      if (this.isOpenEbook) {
        window.location.reload();
      }
    });

    history.pushState(null, '', window.location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', window.location.href);
      if (this.isOpenEbook) {
        window.location.reload();
      }
    });
  }
  public toolbarItems = ['Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields']

  Opentemplate() {
    this.showDialog = true; // Show dialog when loading content
    this.ebookMakerService.getTemplateContent(this.template.content).subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.editorObj && this.editorObj.documentEditor) {
            this.editorObj.documentEditor.open(reader.result as string);
            this.editorObj.documentEditor.documentName = this.template.name;
          } else {
            // console.error('DocumentEditorContainerComponent is not initialized.');
          }
        };
        reader.readAsText(data);

        this.showDialog = false; // Hide dialog when content is loaded
      },
      (error: any) => {
        console.error('Error loading template:', error);
        console.log(error.message);
      }
    );
    this.isOpenEbook = true;
  }
  ngOnInit(): void {

    this.ebookService.getCategories().subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error: any) => {
        console.log(error.message);
      }
    );

    let token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
        }
      );
    }
  }
  createEbook() {
    this.router.navigate(['/maker/templates']);

  }
  public onFileOpenClick(): void {
    // Open file picker.
    if (this.userProfile) {

      (document.getElementById('open_sfdt') as HTMLElement).click();

    } else {
      this.opensigninDialog();
    }

  }

  public onFileChange(e: any): void {
    this.showDialog = true; // Show dialog when loading contents
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
          this.showDialog = false; // Hide dialog when content is loaded
        };
        this.isOpenEbook = true;
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


  async chooseDirectory() {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      return dirHandle;
    } catch (err) {
      console.error('Directory selection was cancelled.', err);
      return null;
    }
  }
  async createFile(dirHandle: any, fileName: string, content: string) {
    try {
      await this.openEbookNameDialog();
      if (!this.ebooksavedTitle) {
        return;
      }

      this.showDialog = true; // Show dialog when loading contents

      const fileHandle = await dirHandle.getFileHandle(this.ebooksavedTitle + '.sfdt', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      this.fileHandle = fileHandle;
      this.showDialog = false; // Hide dialog when content is loaded
      this.alertMessage = 'Document saved successfully.';
      this.alertDialog();

    } catch (err) {
      console.error('Error writing file.', err);
    }
  }

  async updateFile(content: string) {
    try {
      this.showDialog = true; // Show dialog when loading contents
      const writable = await this.fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      this.showDialog = false; // Hide dialog when content is loaded
      this.alertMessage = 'Document updated successfully.';
      this.alertDialog();
    } catch (err) {
      console.error('Error updating file.', err);
    }
  }
  // Method to open the eBook name dialog and return a promise that resolves with the entered title
  openEbookNameDialog(): Promise<string> {
    return new Promise((resolve, reject) => {
      const dialog = document.getElementById('ebookNameDialog') as HTMLDialogElement;
      const input = document.getElementById('ebooksavedTitle') as HTMLInputElement;
      const okButton = dialog.querySelector('.ok') as HTMLButtonElement;

      // Show the dialog
      dialog.showModal();

      // Function to handle the OK button click event
      const handleOkClick = () => {
        console.log(input.value.trim());
        if (input.value.trim() !== '') {
          this.ebooksavedTitle = input.value.trim();
          resolve(this.ebooksavedTitle);
        } else {
          this.alertMessage = 'Please enter ebook title.';
          this.alertDialog();
          reject('No title entered');
        }
        dialog.close();
      };

      // Add event listener to handle OK button click
      okButton.addEventListener('click', handleOkClick, { once: true });

      // Handle dialog close event
      dialog.addEventListener('close', () => {
        // If dialog is closed without clicking OK, reject the promise
        if (input.value.trim() === '') {
          reject('Dialog closed without entering a title');
        }
      }, { once: true });
    });
  }

  closeEbookNameDialog() {
    const dialog = document.getElementById('ebookNameDialog') as HTMLDialogElement;
    dialog.close();
  }
  public async onSave() {
    const blob = await this.editorObj.documentEditor.saveAsBlob('Sfdt');
    const reader = new FileReader();

    reader.onload = async () => {
      const content = reader.result as string;
      if (this.fileHandle) {
        // Update the existing file
        await this.updateFile(content);
      } else {
        // Ask the user to choose a directory and create the file
        this.dirHandle = await this.chooseDirectory();
        if (this.dirHandle) {
          await this.createFile(this.dirHandle, this.editorObj.documentEditor.documentName + '.sfdt', content);
        } else {
          this.alertMessage = 'No directory selected.';
          this.alertDialog();
        }
      }
    };
    reader.readAsText(blob);
  }

  public onPrint() {
    this.editorObj.documentEditor.print();
  }

  public items: ItemModel[] = [
    {
      text: "Word Document (*.docx)",
      id: "docx",
    },
    {
      text: "Text (*.txt)",
      id: "txt",
    },
    {
      text: "Pdf (*.pdf)",
      id: "pdf",
    },
    {
      text: "ePub (*.epub)",
      id: "epub",
    },
    {
      text: "openDocument Text (*.odt)",
      id: "odt",
    }
  ];

  // Method to handle item click event
  async onExportItemClick(event: any) {
    if (this.ebooksavedTitle === '') {
      await this.openEbookNameDialog();
      if (this.ebooksavedTitle === '') {
        return;
      }
    }

    if (event.item.properties.id === 'docx') {
      this.editorObj.documentEditor.save(this.ebooksavedTitle, 'Docx');
    } else if (event.item.properties.id === 'txt') {
      this.editorObj.documentEditor.save(this.ebooksavedTitle, 'Txt');
    } else if (event.item.properties.id === 'pdf') {
      this.onExportAsPDF(this.ebooksavedTitle);
    } else if (event.item.properties.id === 'epub') {
      this.onSaveEpub(this.ebooksavedTitle);
    } else if (event.item.properties.id === 'odt') {
      this.onSaveOdt(this.ebooksavedTitle);
    }

  }
  public onExportAsPDF(filename: string) {
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
            pdfdocument.save(filename + '.pdf');

          }
        };
      }, 500);
    }
  }

  async onSaveEpub(filename: string) {
    let name = filename;
    this.docBlobTemp = this.editorObj.documentEditor.saveAsBlob("Docx");
    const blob = await this.docBlobTemp;
    this.docxToEpubService.convertDocxToEpub(blob, name);
  }
  public onSaveOdt(filename: string) {
    let name = filename;
    this.converterService.convertDocxToOdt(
      this.editorObj.documentEditor.saveAsBlob("Docx"),
      name
    );
  }
  openPublishDialog(): void {
    const dialog = document.getElementById('publishDialog') as HTMLDialogElement;
    dialog.showModal();
  }

  closePublishDialog(): void {
    const dialog = document.getElementById('publishDialog') as HTMLDialogElement;
    dialog.close();
  }

  selectCategories(selectedOptions: HTMLCollectionOf<HTMLOptionElement>): void {
    this.selectedCategories = [];
    Array.from(selectedOptions).forEach(option => {
      const selectedCategory = this.categories.find(category => category.name === option.value);
      if (selectedCategory) {
        this.selectedCategories.push(selectedCategory);
      }
    });

    if (this.ebookTitle == '') {
      this.alertMessage = 'Please enter ebook title.';
      this.alertDialog();
      return;
    }
    if (this.description == '') {
      this.alertMessage = 'Please enter description.';
      this.alertDialog();
      return;
    }
    if (this.selectedCategories.length === 0) {
      this.alertMessage = 'Please select at least one category.';
      this.alertDialog();
      return;
    }
    this.closePublishDialog();

    this.publish(this.fileHandle);
  }

  async publish(entry: any) {
    this.showDialog = true; // Show dialog when loading content
    const pageCount: number = this.editorObj.documentEditor.pageCount;
    this.editorObj.documentEditor.documentEditorSettings.printDevicePixelRatio = 3;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const format: ImageFormat = 'image/jpeg' as ImageFormat;
      const image = await new Promise<HTMLImageElement>((resolve) => {
        setTimeout(() => {
          const img = this.editorObj.documentEditor.exportAsImage(i, format);
          img.onload = () => resolve(img);
        }, 500);
      });
      images.push(image);
    }

    // Create a PDF document using jsPDF
    const pdf = new jsPDF();
    const a4Width = 210; // Width in mm for A4
    const a4Height = 297; // Height in mm for A4

    images.forEach((image, index) => {
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;

      // Calculate scaling factor to fit A4 dimensions
      const scaleFactor = a4Width / imageWidth;
      const scaledHeight = imageHeight * scaleFactor;

      if (index > 0) {
        pdf.addPage();
      }

      // Add image to PDF with scaled dimensions
      pdf.addImage(image.src, 'JPEG', 0, 0, a4Width, scaledHeight);
    });

    // Convert the PDF to a Blob
    const pdfBlob = pdf.output('blob');

    // Call service to publish document
    this.ebookMakerService.publish(pdfBlob, this.ebookTitle, this.userProfile.id.toString(), this.description, this.selectedCategories).subscribe(
      (_res: any) => {
        this.showDialog = false; // Hide dialog when content is loaded
        this.alertMessage = 'Document published successfully and it will be reviewed by our team.';
        this.alertDialog();
      },
      (error: any) => {
        console.error('Error publishing document:', error.message);
      }
    );
  }


  public itemBeforeEvent(args: MenuEventArgs) {
    args.element.style.height = '105px';
  }


  opensigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.showModal();
    const okButton = dialog.querySelector('.ok') as HTMLButtonElement;
    okButton.addEventListener('click', () => {
      this.events.emit('openSigninDialog', '/maker/editor');
      this.router.navigate(['/authentication']);
    });
  }

  closesigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.close();
  }
  alertDialog(): void {
    const dialog = document.getElementById('alertDialog') as HTMLDialogElement;
    dialog.showModal();
  }

  closeAlertDialog(): void {
    const dialog = document.getElementById('alertDialog') as HTMLDialogElement;
    dialog.close();
  }
}
