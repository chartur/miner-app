import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesDialogComponent } from './purchases-dialog.component';

describe('PurchasesDialogComponent', () => {
  let component: PurchasesDialogComponent;
  let fixture: ComponentFixture<PurchasesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
