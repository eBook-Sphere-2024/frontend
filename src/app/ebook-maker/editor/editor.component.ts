import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { DocumentEditorContainerComponent, ImageFormat, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { PdfBitmap, PdfDocument, PdfPageOrientation, PdfPageSettings, PdfSection, SizeF } from '@syncfusion/ej2-pdf-export';
import '@syncfusion/ej2-pdf-export';
import { EventService } from '../../../shared/services/EventService';
import { Router, NavigationEnd } from '@angular/router';
import { Template } from '../../../shared/models/Template';
import { EbookMakerService } from '../ebook-maker.service';
import { EBookService } from '../../reading-section/e-book/e-book.service';
import { Category } from '../../../shared/models/Category';
import { User } from '../../../shared/models/User';
import { UserServices } from '../../User/user.service';

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

  constructor(private locationStrategy: LocationStrategy, private userService: UserServices, private ebookService: EBookService, private router: Router, private events: EventService, private ebookMakerService: EbookMakerService) {
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

  Opentemplate() {
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
      },
      (error: any) => {
        console.error('Error loading template:', error);
        alert(error.message);
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
        alert(error.message);
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
      const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      this.fileHandle = fileHandle;  // Store the fileHandle for subsequent saves
      alert('Document saved successfully.');
    } catch (err) {
      console.error('Error writing file.', err);
    }
  }

  async updateFile(content: string) {
    try {
      const writable = await this.fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      alert('Document updated successfully.');
    } catch (err) {
      console.error('Error updating file.', err);
    }
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
          alert('No directory selected.');
        }
      }
    };
    reader.readAsText(blob);
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
            pdfDocument.save(this.editorObj.documentEditor.documentName + '.pdf' || 'sample.pdf');
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

    if (this.selectedCategories.length === 0) {
      alert('Please select at least one category.');
      return;
    }
    if (this.ebookTitle == '') {
      alert('Please enter ebook title');
      return;
    }
    if (this.description == '') {
      alert('Please enter description');
      return;
    }
    this.closePublishDialog();

    this.publish(this.fileHandle);
  }

  async publish(entry: any) {
    try {
      // Trigger PDF export
      this.onExportAsPDF();

      const chooseDirPromise = this.chooseDirectory();
      let timeout = setTimeout(() => {
        clearTimeout(timeout);
        alert("Please choose a directory promptly.");
        throw new Error("Directory selection timeout");
      }, 15000); // 15 seconds timeout

      this.dirHandle = await chooseDirPromise;
      clearTimeout(timeout);

      if (this.dirHandle) {
        let maxNumber = -Infinity; // Initialize to very small number
        let maxEntry = null;

        // Fetch directory entries
        const dirEntries = await this.dirHandle.values();

        for await (const dirEntry of dirEntries) {
          const fileName = dirEntry.name;
          const regex = /^(.+)\((\d+)\)\.pdf$/; // Regex to match "name(number).pdf"
          const match = fileName.match(regex);

          if (match) {
            const currentNumber = parseInt(match[2], 10); // Extract and parse the number
            if (currentNumber > maxNumber) {
              maxNumber = currentNumber;
              maxEntry = dirEntry;
              entry = maxEntry;
            }
          } else {
            if (dirEntry.name === this.editorObj.documentEditor.documentName + '.pdf') {
              entry = dirEntry;
            }
          }
        }

        // Read PDF file
        const pdfDocument = await this.readPDFFile(entry);

        // Call service to publish document
        this.ebookMakerService.publish(pdfDocument, this.ebookTitle, this.userProfile.id.toString(), this.description, this.selectedCategories).subscribe(
          (_res: any) => {
            alert('Document published successfully and it will be reviewed by our team.');
          },
          (error: any) => {
            alert('Error publishing document: ' + error.message);
          }
        );
      } else {
        alert('No directory selected.'); // Handle case where directory selection failed
      }
    } catch (error) {
      console.error('Error in publish():', error); // Log any unexpected errors
      alert('An unexpected error occurred. Please try again.'); // Notify user of unexpected error
    }
  }
  async readPDFFile(entry: any): Promise<any> {
    try {
      const file = await entry.getFile();
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      return new Promise<any>((resolve, reject) => {
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          resolve(arrayBuffer);
        };
        fileReader.onerror = reject;
      });
    } catch (err) {
      console.error('Error reading PDF file:', err);
      throw err; // Propagate the error
    }
  }

  public itemBeforeEvent(args: MenuEventArgs) {
    args.element.style.height = '105px';
  }
}
