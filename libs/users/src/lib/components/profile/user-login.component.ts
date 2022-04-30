import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from "../../services/users.service"
import { User } from "../../models/user"
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

  constructor(
    private router: Router,
    private userService : UsersService,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.userid) {
        this._getUser(params.userid);
      }
    });
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
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