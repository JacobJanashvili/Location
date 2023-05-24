import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationPage } from './pagination.page';

describe('PaginationPage', () => {
  let component: PaginationPage;
  let fixture: ComponentFixture<PaginationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaginationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
