import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRefsDialogComponent } from './claim-refs-dialog.component';

describe('TaskDialogComponent', () => {
  let component: ClaimRefsDialogComponent;
  let fixture: ComponentFixture<ClaimRefsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimRefsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimRefsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
