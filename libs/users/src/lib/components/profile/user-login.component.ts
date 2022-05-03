import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from "../../services/users.service"
import { AuthService } from '@bluebits/users';
import { User } from "../../models/user"
import { LocalstorageService } from "../../services/localstorage.service"
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'user-profile',
  templateUrl: './user-login.component.html',
  styles: []
})
export class ProfileComponent implements OnInit, OnDestroy{
  user : User
  endsubs$: Subject<any> = new Subject();
  id :string
  

  constructor(
    private router: Router,
    private userService : UsersService,
    private route : ActivatedRoute,
    private authService : AuthService,
    private localStorage : LocalstorageService
  ) {

    this._userAuth()  
    if (localStorage.getToken()) {
        this.id = localStorage.getUserIdFromToken()
        this._getUser(this.id);
    }

  }

  ngOnInit(): void {
    
    this._userAuth()  
    if (localStorage.getToken()) {
        console.log(localStorage.getToken())
        this.id = localStorage.getToken()
        // this._getUser(this.id);
    }
    
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  _userAuth() {
    return this.userService.isCurrentUserAuth()
  }

  logout() {
    this.localStorage.removeToken();
    this.router.navigate(['/']);
  }

  private _getUser(id: string) {
    this.userService
      .getUser(id)
      .pipe(takeUntil(this.endsubs$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  
}