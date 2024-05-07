import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EBookComponent } from './reading-section/e-book/e-book.component';
import { EBookDetailsComponent } from './reading-section/e-book/e-book-details/e-book-details.component';
import { ReadingSectionComponent } from './reading-section/reading-section.component';

const routes: Routes = [
  { path: 'reading', component: ReadingSectionComponent },
  { path: 'ebooks', component: EBookComponent },
  { path: 'ebooks/:id', component: EBookDetailsComponent },
  { path: 'ebooks/category/:id', component: EBookComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
