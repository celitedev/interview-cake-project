import { Component, OnInit } from '@angular/core';

import { Topic } from '../services/topic';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-general-topic',
  templateUrl: './general-topic.component.html',
  styleUrls: ['./general-topic.component.css']
})
export class GeneralTopicComponent implements OnInit {

  topics: Topic[];
  
  constructor(private topicService: TopicService) { }

  ngOnInit() {
    this.getTopics();
  }

  getTopics(): void {
    this.topicService.getTopics()
    .subscribe(topics => this.topics = topics);
  }
}
