import { Component, OnInit } from '@angular/core';
import { EBookService } from '../e-book.service';
import { EventService } from '../../../../shared/services/EventService';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { User } from '../../../../shared/models/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {
  user!: User;
  pdfSrc!: string;
  ebookId: string | null = null;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(private route: ActivatedRoute, private ebookService: EBookService, private events: EventService) {
    this.ebookId = this.route.snapshot.paramMap.get('contentId');
    this.loadEbookContent();
  }

  ngOnInit(): void {
    this.events.listen('pdfVieweruser', (data: User) => {
      this.user = data;
    });
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

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('ebookId', this.ebookId);
    console.log('User ', this.user);
    console.log('Current Page:', this.currentPage);
  }
}
