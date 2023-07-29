import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Order {
  id?: number;
  products: { product_id: number; quantity: number }[];
}

@Component({
  selector: 'app-order-form-dialog',
  templateUrl: './order-form-dialog.component.html',
  styleUrls: ['./order-form-dialog.component.css'],
})
export class OrderFormDialogComponent {
  products: Product[] = [];
  selectedProduct: Product | undefined;
  selectedProductQuantity: number = 1;

  orderProducts: { product_id: number; quantity: number; product: Product }[] =
    [];

  constructor(
    public dialogRef: MatDialogRef<OrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http
      .get<Product[]>('http://localhost:8000/api/products')
      .subscribe((products) => {
        this.products = products;
      });
  }

  addProduct() {
    if (this.selectedProductQuantity <= 0 || !this.selectedProduct) return;

    this.orderProducts.push({
      product_id: this.selectedProduct?.id,
      quantity: this.selectedProductQuantity,
      product: this.selectedProduct,
    });

    this.selectedProduct = undefined;
    this.selectedProductQuantity = 1;
  }

  deleteProduct(product: Product) {
    this.orderProducts = this.orderProducts.filter(
      (orderProduct) => orderProduct.product_id !== product.id
    );
  }

  submitForm() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const orderData = {
      user_id: userId,
      products: this.orderProducts,
    };

    this.http
      .post('http://localhost:8000/api/orders', orderData)
      .subscribe((response: any) => {
        if (response?.status === 1) {
          this.dialogRef.close();
        } else {
          alert('Error al crear el pedido');
        }
      });
  }
}
