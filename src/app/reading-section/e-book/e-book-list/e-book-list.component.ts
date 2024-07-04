import { Component, Input, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../../shared/services/EventService';

@Component({
  selector: 'app-e-book-list',
  templateUrl: './e-book-list.component.html',
  styleUrls: ['./e-book-list.component.css'] // Use styleUrls instead of styleUrl
})
export class EBookListComponent implements OnInit {
  @Input() eBooks: eBookItem[] = [];

  constructor(private events: EventService, private bookService: EBookService) {

  }

  ngOnInit(): void {
  }

}
