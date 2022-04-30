import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {SlideMenuModule} from 'primeng/slidemenu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(
    private router: Router
  ) {}

  onClick() {
    this.router.navigate(['/']);
  }
}
