import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireSubDialogComponent } from './require-sub-dialog.component';

describe('RequireSubDialogComponent', () => {
  let component: RequireSubDialogComponent;
  let fixture: ComponentFixture<RequireSubDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequireSubDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequireSubDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
