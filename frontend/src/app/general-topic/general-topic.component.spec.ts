import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTopicComponent } from './general-topic.component';

describe('GeneralTopicComponent', () => {
  let component: GeneralTopicComponent;
  let fixture: ComponentFixture<GeneralTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
