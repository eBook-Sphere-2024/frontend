import { Component, OnInit,OnDestroy } from '@angular/core';
import { EBookService } from '../e-book.service';
import { EventService } from '../../../../shared/services/EventService';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { User } from '../../../../shared/models/User';
import { ActivatedRoute } from '@angular/router';
import { UserServices } from '../../../User/user.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit,OnDestroy {
  user!: User;
  pdfSrc!: string;
  ebookId: string | null = null;
  totalPages: number = 0;
  currentPage: number = 1;
  highest_progress: number=1;
  private timer: any;
  constructor(private route: ActivatedRoute, private ebookService: EBookService, private events: EventService,private userService:UserServices) {
    this.ebookId = this.route.snapshot.paramMap.get('contentId');
    this.loadEbookContent();
  }
  ngOnDestroy(): void {
    if(this.currentPage>this.highest_progress)
      this.highest_progress=this.currentPage;

    let dataPatch={
      "currentPgae": this.currentPage,
      "highest_progress": this.highest_progress,
      "totalPages": this.totalPages
  }
  let dataPost={
      "user":this.user.id,
      "ebook":this.ebookId,
      "currentPgae": this.currentPage,
      "highest_progress": this.highest_progress,
      "totalPages": this.totalPages
  }

    this.userService.updateReaderAnalysis(this.user.id,this.ebookId!,dataPost,dataPatch).subscribe(
      (data:any)=>{
        console.log(data);
      },
      (error:any)=>console.log(error)
    )
    console.log("done");
    // Clear the timer
    if (this.timer) {
      console.log("Timer: ", this.timer);
      clearInterval(this.timer);
      console.log('Timer stopped');
    }
  }

  ngOnInit(): void {
    this.events.listen('pdfVieweruser', (data: User) => {
      this.user = data;
    });
    this.timer = setInterval(() => {
      console.log('Timer is running');
    }, 1000);
  }

  loadEbookContent(): void {
    if (this.ebookId) {
      this.ebookService.getEbookContent(this.ebookId).subscribe(
        (res: any) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          this.pdfSrc = URL.createObjectURL(blob);
          console.log(this.pdfSrc);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }

  }
  onPagesLoaded(event: any): void {
      this.totalPages = event.pagesCount;
    }
  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('ebookId', this.ebookId);
    console.log('User ', this.user);
    console.log('Current Page:', this.currentPage);
    console.log('Highest Progress: ',this.highest_progress)
    console.log('Total pages: ',this.totalPages);
    if(this.currentPage>this.highest_progress)
      this.highest_progress=this.currentPage;
  }
}
