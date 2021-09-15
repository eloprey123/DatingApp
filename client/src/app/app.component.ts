import { PresenceService } from './_services/presence.service';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // collapsed = true;
  title = 'The Dating App';
  users: any;

  constructor(
    private accountService: AccountService,
    private presence: PresenceService
  ) {
  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }

  // cout() {
  //   if (!this.collapsed) {
  //     this.collapsed = true;
  //   }
  //   console.log(this.collapsed);
  // }

  // @HostListener("window:resize", []) updateCollapsed() {
  //   this.collapsed = true
  //   console.log(this.collapsed);
  // }

}
