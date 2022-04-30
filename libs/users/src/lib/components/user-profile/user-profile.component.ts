import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service'
import { User } from "../../models/user"

@Component({
  selector: 'users-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
  ]
})
export class UserProfileComponent implements OnInit{
  @Input() user : User

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  Submit() {
    this.router.navigate(['/profile']);
  }

}
