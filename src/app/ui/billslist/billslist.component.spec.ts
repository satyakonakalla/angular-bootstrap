import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillslistComponent } from './billslist.component';

describe('BillslistComponent', () => {
  let component: BillslistComponent;
  let fixture: ComponentFixture<BillslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
