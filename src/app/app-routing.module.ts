import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EBookComponent } from './reading-section/e-book/e-book.component';
import { EBookDetailsComponent } from './reading-section/e-book/e-book-details/e-book-details.component';
import { ReadingSectionComponent } from './reading-section/reading-section.component';
import { SearchBarComponent } from './reading-section/e-book/search-bar/search-bar.component';
import { AuthenticationComponent } from './User/authentication/authentication.component';
import { ProfileComponent } from './User/UserInfo/profile/profile/profile.component';


const routes: Routes = [
  { path: 'reading', component: ReadingSectionComponent },
  { path: 'reading/ebooks', component: EBookComponent },
  { path: 'reading/ebooks/:id', component: EBookDetailsComponent },
  { path: 'reading/ebooks/category/:id', component: EBookComponent },
  { path: 'search', component: SearchBarComponent },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'profile', component: ProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
