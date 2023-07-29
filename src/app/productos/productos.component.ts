import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductFormDialogComponentComponent } from '../product-form-dialog-component/product-form-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Order } from '../pedidos/pedidos.component';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<Product[]>('http://localhost:8000/api/products')
      .subscribe((data: Product[]) => {
        this.dataSource.data = data;
      });
  }

  openDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponentComponent, {
      width: '250px',
      data: product ? product : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadProducts(); // Reload the products after closing the dialog.
    });
  }

  editProduct(product: Product) {
    this.openDialog(product);
  }

  addProduct() {
    this.openDialog();
  }

  deleteProduct(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.http
      .delete(`http://localhost:8000/api/products/${id}`)
      .subscribe((data) => {
        this.loadProducts();
      });
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}
