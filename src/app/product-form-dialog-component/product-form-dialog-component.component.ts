import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-form-dialog-component',
  templateUrl: './product-form-dialog-component.component.html',
  styleUrls: ['./product-form-dialog-component.component.css'],
})
export class ProductFormDialogComponentComponent {
  formGroup: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponentComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public product: any
  ) {
    this.formGroup = this.formBuilder.group({
      name: [product ? product.name : '', Validators.required],
      description: [product ? product.description : '', Validators.required],
      price: [product ? product.price : '', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.errorMessage = '';

      if (this.product) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    }
  }

  updateProduct() {
    const productId = this.product.id;
    const productData = {
      name: this.formGroup.get('name')?.value,
      description: this.formGroup.get('description')?.value,
      price: this.formGroup.get('price')?.value,
    };
    this.http
      .put(`http://localhost:8000/api/products/${productId}`, productData)
      .subscribe((response: any) => {
        if (response?.status === 1) {
          this.dialogRef.close();
        } else {
          alert('Producto no actualizado');
        }
      });
  }

  createProduct() {
    const data = {
      name: this.formGroup.get('name')?.value,
      description: this.formGroup.get('description')?.value,
      price: this.formGroup.get('price')?.value,
    };
    this.http
      .post('http://localhost:8000/api/products', data)
      .subscribe((response: any) => {
        if (response?.status === 1) {
          this.dialogRef.close();
        } else {
          alert('Producto no creado');
        }
      });
  }
}
