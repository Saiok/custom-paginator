import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RondevuPaginatorComponent } from './rondevu-paginator.component';

describe('RondevuPaginatorComponent', () => {
  let component: RondevuPaginatorComponent;
  let fixture: ComponentFixture<RondevuPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RondevuPaginatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RondevuPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
