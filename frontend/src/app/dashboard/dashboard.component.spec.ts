import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TOPICS } from '../services/mock-topics';
import { TopicService } from '../services/topic.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let topicService;
  let getTopicsSpy;

  beforeEach(async(() => {
    topicService = jasmine.createSpyObj('TopicService', ['getTopics']);
    getTopicsSpy = topicService.getTopics.and.returnValue( of(TOPICS) );
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TopicService, useValue: topicService }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Topics" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top Topics');
  });

  it('should call topicService', async(() => {
    expect(getTopicsSpy.calls.any()).toBe(true);
    }));

  it('should display 4 links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));

});
