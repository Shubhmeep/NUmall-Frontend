import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { LocalstorageService } from "../../../../../users/src/lib/services/localstorage.service"
import { User } from "../../../../../users/src/lib/models/user"

@Component({
  
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private localStorage: LocalstorageService,
  ) {
      this.userId = localStorage.getUserIdFromToken()
  }
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId: string;
  user: User
  countries = [];
  unsubscribe$: Subject<any> = new Subject();
  endsubs$: Subject<any> = new Subject();

  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData(this.userId);
    this._getCartItems();
    this._getCountries();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _autoFillUserData(id: string) {
    // this.usersService
    //   .getUser(id)
    //   .pipe(takeUntil(this.endsubs$))
    //   .subscribe((user) => {
    //     this.user = user
    //     if (this.user) {
    //       this.userId = localStorage.getUserIdFromToken();
    //       this.checkoutForm.name.setValue(this.user.name);
    //       this.checkoutForm.email.setValue(this.user.email);
    //       this.checkoutForm.phone.setValue(this.user.phone);
    //       this.checkoutForm.city.setValue(user.city);
    //       this.checkoutForm.street.setValue(user.street);
    //       this.checkoutForm.country.setValue(user.country);
    //       this.checkoutForm.zip.setValue(user.zip);
    //       this.checkoutForm.apartment.setValue(user.apartment);
    this.usersService.getUser(id).pipe(takeUntil(this.endsubs$)).subscribe((user) => {
      this.checkoutForm.name.setValue(user.name);
      this.checkoutForm.email.setValue(user.email);
      this.checkoutForm.phone.setValue(user.phone);
      this.checkoutForm.street.setValue(user.street);
      this.checkoutForm.apartment.setValue(user.apartment);
      this.checkoutForm.zip.setValue(user.zip);
      this.checkoutForm.city.setValue(user.city);
      this.checkoutForm.country.setValue(user.country);
      //   }
      // });
    })};

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm.street.value,
      shippingAddress2: this.checkoutForm.apartment.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`
    };

    this.ordersService.createOrder(order).subscribe(
      () => {
        //redirect to thank you page // payment
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      },
      () => {
        //display some message to user
      }
    );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
