import { Pagination } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { LikesParams } from '../_models/likesParams';
import { Member } from '../_models/member';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  likesParams: LikesParams;
  pagination: Pagination;

  constructor(
    private memberService: MemberService
  ) {
    this.likesParams = this.memberService.getLikesParams();
  }

  ngOnInit() {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.setLikesParams(this.likesParams);
    this.memberService.getLikes(this.likesParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.likesParams.pageNumber = event.page;
    this.memberService.setLikesParams(this.likesParams);
    this.loadLikes();
  }

}
