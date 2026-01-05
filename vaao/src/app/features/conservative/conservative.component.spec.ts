import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConservativeComponent } from './conservative.component';

describe('ConservativeComponent', () => {
  let component: ConservativeComponent;
  let fixture: ComponentFixture<ConservativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConservativeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConservativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
