import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EBookComponent } from './reading-section/e-book/e-book.component';
import { EBookDetailsComponent } from './reading-section/e-book/e-book-details/e-book-details.component';
import { ReadingSectionComponent } from './reading-section/reading-section.component';
import { SearchBarComponent } from './reading-section/e-book/search-bar/search-bar.component';
import { AuthenticationComponent } from './User/authentication/authentication.component';
import { ProfileComponent } from './User/UserInfo/profile/profile.component';
import { UserInfoComponent } from './User/UserInfo/user-info.component';
import { CreatedBooksComponent } from './User/UserInfo/created-books/created-books.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChangePasswordComponent } from './User/UserInfo/change-password/change-password.component';
import { ForgetPasswordComponent } from './User/forget-password/forget-password.component';
import { EmailValidationComponent } from './User/forget-password/email-validation/email-validation.component';
import { ResetPasswordComponent } from './User/forget-password/reset-password/reset-password.component';
import { EbookMakerComponent } from './ebook-maker/ebook-maker.component';
import { EditorComponent } from './ebook-maker/editor/editor.component';
import { TemplatesComponent } from './ebook-maker/templates/templates.component';
import { FavoriteListComponent } from './User/UserInfo/favorite-list/favorite-list.component';
import { ReaderComponent } from './reading-section/e-book/reader/reader.component';
import { BookAnalysisComponent } from './User/UserInfo/book-analysis/book-analysis.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'reading', component: ReadingSectionComponent },
  { path: 'reading/ebooks', component: EBookComponent },
  { path: 'reading/ebooks/:id', component: EBookDetailsComponent },
  { path: 'reading/ebooks/category/:id', component: EBookComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'authentication', component: AuthenticationComponent },
  {
    path: 'User', component: UserInfoComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'createdBooks', component: CreatedBooksComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'FavoriteList', component: FavoriteListComponent },
      { path: 'BookAnalysis/:id', component: BookAnalysisComponent },
      { path: '', component: ProfileComponent },
    ]
  },
  { path: 'ForgetPasswordByEmail', component: EmailValidationComponent },
  { path: 'resetPassword/:uidb64/:token', component: ResetPasswordComponent },
  { path: 'maker', component: EbookMakerComponent },
  { path: 'maker/editor', component: EditorComponent },
  { path: 'maker/templates', component: TemplatesComponent },
  { path: 'read/:contentId', component: ReaderComponent },
  { path: 'Home', component: HomeComponent },
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
