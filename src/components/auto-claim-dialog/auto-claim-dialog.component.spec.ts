import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoClaimDialogComponent } from './auto-claim-dialog.component';

describe('AutoClaimDialogComponent', () => {
  let component: AutoClaimDialogComponent;
  let fixture: ComponentFixture<AutoClaimDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoClaimDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
