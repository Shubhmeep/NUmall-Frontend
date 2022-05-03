import { Component, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../../models/user"
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
  ]
})
export class UserProfileComponent implements OnInit{
  @Input() user : User
  id : string

  constructor(
    private router: Router,
    private auth: AuthService,
    private localstorageService: LocalstorageService,
  ) {
    this.id = localstorageService.getToken();
  }

  ngOnInit(): void {
    
  }
  
  checkuser() {
      if(this.id){
        this.router.navigate(['/profile']);
      }else{
        this.router.navigate(['/login']);
      }
  }

}
