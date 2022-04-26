import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareExamComponent } from './prepare-exam.component';

describe('PrepareExamComponent', () => {
  let component: PrepareExamComponent;
  let fixture: ComponentFixture<PrepareExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
