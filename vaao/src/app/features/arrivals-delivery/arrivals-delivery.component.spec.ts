import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsDeliveryComponent } from './arrivals-delivery.component';

describe('ArrivalsDeliveryComponent', () => {
  let component: ArrivalsDeliveryComponent;
  let fixture: ComponentFixture<ArrivalsDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrivalsDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrivalsDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
