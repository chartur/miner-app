import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViaWebNotWorkingComponent } from './app-via-web-not-working.component';

describe('AppViaWebNotWorkingComponent', () => {
  let component: AppViaWebNotWorkingComponent;
  let fixture: ComponentFixture<AppViaWebNotWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppViaWebNotWorkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppViaWebNotWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
