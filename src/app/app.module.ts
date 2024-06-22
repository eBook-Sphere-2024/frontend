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
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent,
    FooterComponent,
    HomeComponent
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
    EbookMakerModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(), ToolbarService, PrintService, WordExportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
