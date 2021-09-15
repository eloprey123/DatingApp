import { ConfirmService } from './../_services/confirm.service';
import { AccountService } from './../_services/account.service';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
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
  collapsed = true;
  // @Output() collapsedChange = new EventEmitter<boolean>();
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('navbarCollapse') navbarCollapse: ElementRef;

  constructor(
    public accountService: AccountService,
    public confirmService: ConfirmService,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton.nativeElement &&
        e.target !== this.navbarCollapse.nativeElement &&
        !this.navbarCollapse.nativeElement.contains(e.target) &&
        !this.toggleButton.nativeElement.contains(e.target) &&
        !this.collapsed) {
          this.collapsed = true;
          console.log(this.collapsed);
        }
    });

    // renderer.listen('window', 'resize', (e: Event) => {
    //   if (window.innerWidth >= 576) {
    //     this.collapsed = false;
    //   }
    // })
  }

  ngOnInit() {
  }

  login() {
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      this.collapsed = true;
      // this.collapsedChange.emit(this.collapsed);
    });
  }

  logout() {
    this.confirmService.confirm('Confirm Logout', 'Leave App')
      .subscribe(result => {
        if (result) {
          this.accountService.logout();
          this.collapsed = true;
          this.router.navigateByUrl('/');
        }
      });
  }

  toggled() {
    this.collapsed = !this.collapsed;
    console.log(this.collapsed);
    // this.collapsedChange.emit(this.collapsed);
  }

  clickCollapse() {
    if (!this.collapsed) {
      this.collapsed = true;
      // this.collapsedChange.emit(this.collapsed);
    }
  }

  // status() {
  //   if (this.collapsed)
  //     this.collapsed = false;
  //   console.log(this.collapsed);
  // }

}
