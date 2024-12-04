import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCoinDialogComponent } from './buy-coin-dialog.component';

describe('BuyCoinDialogComponent', () => {
  let component: BuyCoinDialogComponent;
  let fixture: ComponentFixture<BuyCoinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyCoinDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
