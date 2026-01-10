import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSellsComponent } from './detail-sells.component';

describe('DetailSellsComponent', () => {
  let component: DetailSellsComponent;
  let fixture: ComponentFixture<DetailSellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSellsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailSellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
