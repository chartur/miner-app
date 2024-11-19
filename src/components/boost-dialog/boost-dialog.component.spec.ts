import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeBoostDialogComponent } from './free-boost-dialog.component';

describe('FreeBoostDialogComponent', () => {
  let component: FreeBoostDialogComponent;
  let fixture: ComponentFixture<FreeBoostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeBoostDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeBoostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
