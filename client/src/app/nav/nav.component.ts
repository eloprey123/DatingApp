import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  @Input() collapsed: boolean;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }

  login() {
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    });
  }

  logout() {
    this.accountService.logout();
    this.collapsed = true;
    this.collapsedChange.emit(this.collapsed);
    this.router.navigateByUrl('/');
  }

  toggled() {
    this.collapsed = !this.collapsed;
    console.log(this.collapsed);
    this.collapsedChange.emit(this.collapsed);
  }

  clickCollapse() {
    if (!this.collapsed) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  status() {
    if (this.collapsed)
      this.collapsed = false;
    console.log(this.collapsed);
  }

}
