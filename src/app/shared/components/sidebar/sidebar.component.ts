import { SocketService } from './../../../services/socket.service';
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
              private modal: NgbModal,
              private socketService: SocketService) { }

  @Input() userInfo: {
              userId: string,
              firstName: string,
              lastName: string,
              username: string
            };
  @Input() userList: UserObj[];
  @Input() friendList: UserObj[];
  @Input() pendingFriendList: UserObj[];

  userVList: [];

  friend: {
    userId: string,
    username: string
  };

  @ViewChild('modalSendFriendReq', { static: true }) modalSendFriendRequest: TemplateRef<any>;
  @ViewChild('modalAcceptFriendReq', { static: true }) modalAcceptFriendRequest: TemplateRef<any>;

  handleSendRequest(friend) {
    // console.log(this.userList);
    // console.log(friend);
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
        this.sendNotification(`You have received a friend request from ${this.userInfo.username}`, receiver.userId);
        this.userList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      } else {
        this.toastr.error(apiResponse.message);
        this.modal.dismissAll();
      }
    });
  }

  acceptFriendRequest = (senderId, receiver) => {
    this.appService.acceptFriendRequest(senderId, receiver.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(`Congrats! You have accepted the friend request of ${receiver.username}!`);
        this.sendNotification(`Your friend request has been accepted by ${this.userInfo.username}`, receiver.userId);
        this.pendingFriendList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      } else {
        this.toastr.error(apiResponse.message);
        this.modal.dismissAll();
      }
    });
  }

  rejectFriendRequest = (senderId, receiver) => {
    this.appService.rejectFriendRequest(senderId, receiver.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(`Ouuch! You have rejected the friend request of ${receiver.username}!`);
        this.sendNotification(`Your friend request has been rejected by ${this.userInfo.username}`, receiver.userId);
        this.pendingFriendList.splice(this.userList.indexOf(receiver));
        this.modal.dismissAll();
      } else {
        this.toastr.error(apiResponse.message);
        this.modal.dismissAll();
      }
    });
  }

  public sendNotification(msg, id): void {
    const message = {
      senderId: this.userInfo.userId,
      senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
      receiverId: id,
      message: msg
    };
    this.socketService.sendNotification(message);
  }

}
