import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavComponent } from './nav/nav.component';
import { ReadingSectionModule } from './reading-section/reading-section.module';
import { UserModule } from './User/user.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { DocumentEditorModule, DocumentEditorContainerModule, ToolbarService, PrintService, WordExportService } from '@syncfusion/ej2-angular-documenteditor';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { EbookMakerModule } from './ebook-maker/ebook-maker.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReadingSectionModule,
    UserModule,
    DocumentEditorModule,
    DocumentEditorContainerModule,
    ButtonModule,
    DropDownButtonModule,
    EbookMakerModule
  ],
  providers: [
    provideClientHydration(), ToolbarService, PrintService, WordExportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
