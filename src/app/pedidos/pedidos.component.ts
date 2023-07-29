import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderFormDialogComponent } from '../order-form-dialog/order-form-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Order {
  id: number;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  products: Product[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  order_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  quantity: number;
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent {
  orders: Order[] = [];
  displayedColumns: string[] = [
    'id',
    'user',
    'products',
    'created_at',
    'actions',
  ];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.getOrders();
  }

  ngOnInit() {
    //If user is not logged in, redirect to login page
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OrderFormDialogComponent, {
      width: '800px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getOrders();
    });
  }

  getOrders() {
    this.http
      .get<Order[]>('http://localhost:8000/api/orders')
      .subscribe((orders) => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource(orders);
        this.dataSource.paginator = this.paginator;
      });
  }
  deleteOrder(order: Order) {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    this.http
      .delete(`http://localhost:8000/api/orders/${order.id}`)
      .subscribe((data) => {
        this.getOrders();
      });
  }
}
