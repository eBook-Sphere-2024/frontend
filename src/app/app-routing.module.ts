import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EBookComponent } from './reading-section/banner/e-book/e-book.component';
import { EBookDetailsComponent } from './reading-section/banner/e-book/e-book-details/e-book-details.component';


const routes: Routes = [
  { path: 'ebooks', component: EBookComponent },
  { path: 'ebooks/:id', component: EBookDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
