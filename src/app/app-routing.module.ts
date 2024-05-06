import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EBookComponent } from './reading-section/e-book/e-book.component';
import { EBookDetailsComponent } from './reading-section/e-book/e-book-details/e-book-details.component';
import { EBookListComponent } from './reading-section/e-book/e-book-list/e-book-list.component';
import { BannerComponent } from './reading-section/banner/banner.component';


const routes: Routes = [
  { path: 'ebooks/category/:categoryid', component: EBookComponent },
  { path: 'ebooks', component: EBookComponent },
  { path: 'ebooks/:id', component: EBookDetailsComponent} ,
  {path:'banner',component:BannerComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
