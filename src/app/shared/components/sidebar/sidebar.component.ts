import { UserObj } from './../../models/user-obj';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  constructor(private appService: AppService,
              private toastr: ToastrService,
              private modal: NgbModal) { }

  @Input() userInfo: {};
  @Input() userList: UserObj[];
  @Input() friendList: UserObj[];
  @Input() pendingFriendList: UserObj[];

  // userVList = this.userList.filter( x => !this.friendList.includes(x));

  friend: {
    userId: string,
    username: string
  };

  @ViewChild('modalSendFriendReq', { static: true }) modalSendFriendRequest: TemplateRef<any>;
  @ViewChild('modalAcceptFriendReq', { static: true }) modalAcceptFriendRequest: TemplateRef<any>;

  handleSendRequest(friend) {
    console.log(this.userList);
    console.log(friend);
    this.friend = friend;
    this.modal.open(this.modalSendFriendRequest, { size: 'sm' });
  }

  handleAcceptRequest(friend) {
    this.friend = friend;
    this.modal.open(this.modalAcceptFriendRequest, { size: 'sm' });
  }

  ngOnInit() {
  }

  sendFriendRequest = (senderId, receiver) => {
    this.appService.sendFriendRequest(senderId, receiver.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(`Congrats! You have successfully sent a friend request to ${receiver.username}!`);
        this.pendingFriendList = [
          ... this.pendingFriendList,
          receiver
        ];
        this.userList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      }
    });
  }

  acceptFriendRequest = (senderId, receiver) => {
    this.appService.acceptFriendRequest(senderId, receiver.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(`Congrats! You have accepted the friend request of ${receiver.username}!`);
        this.friendList = [
          ... this.friendList,
          receiver
        ];
        this.pendingFriendList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      }
    });
  }

  rejectFriendRequest = (senderId, receiver) => {
    this.appService.rejectFriendRequest(senderId, receiver.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(`Ouuch! You have rejected the friend request of ${receiver.username}!`);
        this.pendingFriendList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      }
    });
  }
}
