import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDownloadCardComponent } from './report-download-card.component';

describe('ReportDownloadCardComponent', () => {
  let component: ReportDownloadCardComponent;
  let fixture: ComponentFixture<ReportDownloadCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDownloadCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportDownloadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
