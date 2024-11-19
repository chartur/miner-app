import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgDialogComponent } from './tg-dialog.component';

describe('TgDialogComponent', () => {
  let component: TgDialogComponent;
  let fixture: ComponentFixture<TgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TgDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
