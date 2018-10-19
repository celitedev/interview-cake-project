import { Component, OnInit, Input } from '@angular/core';

import { Topic } from '../services/topic';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() background: string;
  @Input() isRead: string;

  constructor() { }

  ngOnInit() {
  }

}
