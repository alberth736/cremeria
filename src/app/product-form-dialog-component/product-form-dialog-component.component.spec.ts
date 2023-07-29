import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormDialogComponentComponent } from './product-form-dialog-component.component';

describe('ProductFormDialogComponentComponent', () => {
  let component: ProductFormDialogComponentComponent;
  let fixture: ComponentFixture<ProductFormDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductFormDialogComponentComponent]
    });
    fixture = TestBed.createComponent(ProductFormDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
