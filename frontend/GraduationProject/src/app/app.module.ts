import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentEditorModule, DocumentEditorContainerModule, ToolbarService, PrintService, WordExportService } from "@syncfusion/ej2-angular-documenteditor";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DocumentEditorModule, DocumentEditorContainerModule, ButtonModule, DropDownButtonModule

  ],
  providers: [
    provideClientHydration(), ToolbarService, PrintService, WordExportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
