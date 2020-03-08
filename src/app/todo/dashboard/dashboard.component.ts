import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'src/app/shared/models/item';
import { Todo } from 'src/app/shared/models/todo';
import { ToastrService } from 'ngx-toastr';
import { UserObj } from 'src/app/shared/models/user-obj';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private appService: AppService, private modal: NgbModal,
              private toastr: ToastrService,
              private socketService: SocketService) { }

  user = this.appService.getUserInfoFromLocalStorage();
  authtoken = Cookie.get('authToken');
  public disconnectedSocket: boolean;
  todoList = [];
  userList: UserObj[] = [];
  friendList: UserObj[] = [];
  pendingFriendList = [];
  isShow = false;
  isChildShow = false;
  item = new Item();
  childItem = new Item();
  todo1 = new Todo();

  todo = new Todo();

  @ViewChild('modalCreate', { static: true }) modalCreate: TemplateRef<any>;

  handleTodoEvent(todo?) {
    if (todo) {
      this.todo = todo;
      this.todo1 = JSON.parse(JSON.stringify(this.todo));
    } else {
      this.todo = new Todo();
      this.todo1 = new Todo();
    }
    this.modal.open(this.modalCreate, { size: 'md' });
    // console.log(this.todo);
  }


  fetchUserList = () => {
    this.appService.getAllNormalUsers().subscribe((apiResponse) => {
      this.userList = apiResponse.data;
      // console.log(this.userList);
    });
  }

  fetchFriendList = (userId) => {
    this.appService.getFriendList(userId).subscribe((apiResponse) => {
      // console.log(apiResponse);
      this.friendList = apiResponse.data;
    });
  }

  fetchPendingFriendList = (userId) => {
    this.appService.getPendingFriendList(userId).subscribe((apiResponse) => {
      this.pendingFriendList = apiResponse.data;
    });
  }

  fetchUserTodoList = (userId) => {
    this.appService.getUserTodoList(userId).subscribe((apiResponse) => {
      //  console.log(apiResponse);
      this.todoList = apiResponse.data;
    });
  }

  fetchLastVersionTodo = (userId, parentId, version) => {
    this.appService.getUserTodoLastVersion(userId, parentId, version).subscribe((apiResponse) => {
      // console.log(apiResponse);
      if (apiResponse.data !== 0) {
        this.todo = apiResponse.data;
      }
    });
  }

  ngOnInit() {
    this.user = this.appService.getUserInfoFromLocalStorage();
    this.verifyUserConfirmation();
    this.getNotification();
    this.fetchUserList();
    this.fetchUserTodoList(this.user.userId);
    this.fetchFriendList(this.user.userId);
    this.fetchPendingFriendList(this.user.userId);
  }

  showAddedList() {
    this.item = new Item();
    this.isShow = true;
  }

  showChildAddedList() {
    this.childItem = new Item();
    this.isChildShow = true;
  }

  updateItem(formList) {
    //  console.log(formList);
  }

  addItem(item?, val1?, val2?) {
    if (val2) {
      this.childItem.description = val2;
      this.childItem.isSelected = val1;
    }
    if (item) {
      if (this.childItem.description != null || this.childItem.description !== '' && this.childItem.isSelected !== false) {
        //  console.log(this.childItem);
        this.todo.list[this.todo.list.indexOf(item)].children = [
          ...this.todo.list[this.todo.list.indexOf(item)].children,
          this.childItem
        ];
        this.childItem = new Item();
        this.item = new Item();
      }
      this.isChildShow = false;
    } else {
      if (this.item.description != null || this.item.description !== '' && this.item.isSelected !== false) {
        //  console.log(this.item);
        this.todo.list = [
          ...this.todo.list,
          this.item
        ];
        this.item = new Item();
      }
      this.isShow = false;
    }
  }

  deleteItem(item, child?) {
    if (item) {
      //  console.log(this.todo.list.indexOf(item));
    }
    if (child) {
      this.todo.list[this.todo.list.indexOf(item)].children.splice(this.todo.list[this.todo.list.indexOf(item)].children.indexOf(child), 1);
    } else {
      this.todo.list.splice(this.todo.list.indexOf(item), 1);
    }
  }

  onKeyPress(event) {
    const charCode = String.fromCharCode(event.which).toLowerCase();
    if (event.ctrlKey && charCode === 's') {
      // Do a deept compare to identify the change in the todo.
      // If there is any change then save the entire todo with new version.
      if (this.deepCompare(this.todo, this.todo1)) {
        if (this.todo.createdBy === '') {
          this.todo.createdBy = this.user.userId;
        }
        if (this.todo.modifiedBy === '') {
          this.todo.modifiedBy = this.user.userId;
        }
        if (!this.todo.sharedWith.includes(this.user.userId)) {
          this.todo.sharedWith.push(this.user.userId);
        }
        this.friendList.forEach(friend => {
          if (!this.todo.sharedWith.includes(friend.userId)) {
            this.todo.sharedWith.push(friend.userId);
          }
        });
        if (this.todo1.title !== '' && this.todo.list.length !== 0) {
          this.createNewVersionTodo(this.todo);
          this.fetchUserTodoList(this.user.userId);
          this.sendNotification(`TODO list has been updated by ${this.user.username}`,
                                this.todo.sharedWith.splice(this.todo.sharedWith.indexOf(this.user.userId)));
        } else {
          this.createNewTodo(this.todo);
          this.todoList = [
            ... this.todoList,
            this.todo
          ];
          this.sendNotification(`New TODO list has been created by ${this.user.username}`,
                                this.todo.sharedWith.splice(this.todo.sharedWith.indexOf(this.user.userId)));
        }
        this.todo1 = this.todo1 = JSON.parse(JSON.stringify(this.todo));
        //  console.log(this.todo);
      }
      event.preventDefault();
      return false;
    }
    if (event.ctrlKey && charCode === 'z') {
      this.fetchLastVersionTodo(this.user.userId, this.todo.parentId, this.todo.version);
    }
  }

  press($event) {
    // console.log($event);
  }
  createNewTodo(todo) {
    this.appService.createNewTodo(todo).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.todo.todoId = apiResponse.data.todoId;
        this.todo.version = apiResponse.data.version;
        this.todo.status = apiResponse.data.status;
        this.todo.parentId = apiResponse.data.parentId;
        this.toastr.success('Todo has been saved successfully');
      }
    });
  }

  createNewVersionTodo(todo) {
    this.appService.createNewVersionTodo(todo).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.todo.todoId = apiResponse.data.todoId;
        this.todo.version = apiResponse.data.version;
        this.todo.status = apiResponse.data.status;
        this.todo.parentId = apiResponse.data.parentId;
        this.toastr.success('Todo has been updated successfully');
        // console.log(apiResponse);
      }
    });
  }

  removeTodo(todo) {
    this.appService.removeTodo(todo).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.todoList.splice(this.todoList.indexOf(todo), 1);
        this.toastr.success('Todo has been removed successfully');
      }
    });
  }
  deepCompare(currentTodo, prevTodo) {
    if (currentTodo.title !== prevTodo.title) {
      // console.log(1);
      return true;
    }
    if (currentTodo.version !== prevTodo.version) {
      // console.log(2);
      return true;
    }
    if (currentTodo.list.length !== prevTodo.list.length) {
      // console.log(3);
      return true;
    } else {
      for (let i = 0; i < currentTodo.list.length; i++) {
        if (currentTodo.list[i].isSelected !== prevTodo.list[i].isSelected) {
          // console.log(4);
          return true;
        }
        if (currentTodo.list[i].description !== prevTodo.list[i].description) {
          // console.log(5);
          return true;
        }
        if (currentTodo.list[i].children.length !== prevTodo.list[i].children.length) {
          // console.log(6);
          return true;
        } else {
          for (let j = 0; j < currentTodo.list[i].children.length; j++) {
            if (currentTodo.list[i].children[j].isSelected !== prevTodo.list[i].children[j].isSelected) {
              // console.log(7);
              return true;
            }
            if (currentTodo.list[i].children[j].description !== prevTodo.list[i].children[j].description) {
              // console.log(8);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  public sendNotification(msg, list): void {
    if (Array.isArray(list)) {
      const message = {
        senderId: this.user.userId,
        senderName: this.user.firstName + ' ' + this.user.lastName,
        receiverId: list,
        message: msg
      };
      this.socketService.sendNotification(message);
    }
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(() => {
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authtoken);
    });
  }

  public getNotification: any = () => {
    this.socketService.onReceivingNotification(this.user.userId).subscribe((data) => {
      // console.log(data);
      if (Array.isArray(data.receiverId) && data.receiverId.includes(this.user.userId)) {
        this.toastr.info(`Notification received: "${data.message}"`);
        this.fetchUserTodoList(this.user.userId);
      } else if (this.user.userId === data.receiverId) {
        this.toastr.info(`Notification received: "${data.message}"`);
        this.fetchUserTodoList(this.user.userId);
      }
    });
  }
}
