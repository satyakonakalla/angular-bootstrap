import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillpaymentsComponent } from './billpayments.component';

describe('BillpaymentsComponent', () => {
  let component: BillpaymentsComponent;
  let fixture: ComponentFixture<BillpaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillpaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillpaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
