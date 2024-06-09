import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { DocumentEditorModule, DocumentEditorContainerModule, ToolbarService, PrintService, WordExportService } from '@syncfusion/ej2-angular-documenteditor';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { provideClientHydration } from '@angular/platform-browser';

@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    CommonModule,
    DocumentEditorModule,

    DocumentEditorContainerModule,
    ButtonModule,
    DropDownButtonModule
  ],
  providers: [
    provideClientHydration(), ToolbarService, PrintService, WordExportService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class EbookMakerModule { }
