import { HttpParams, HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

  private url = 'http://localhost:3002';

  constructor(public http: HttpClient) { }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoFromLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public signup = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('firstName', data.firstName)
                    .set('lastName', data.lastName)
                    .set('username', data.username)
                    .set('email', data.email)
                    .set('password', data.password)
                    .set('mobile', data.mobile);
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public login = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('email', data.email)
                    .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  }

  public logout = (): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/users/logout`);
  }

  public forgotPassword = (data): Observable<any> => {
    const params = new HttpParams()
                      .set('email', data.email);
    return this.http.post(`${this.url}/api/v1/users/forgotPassword`, params);
  }

  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
                        .set('email', data.email)
                        .set('newPassword', data.password);
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public getCountryCode = (): Observable<any> => {
    return this.http.get('./../../assets/data/countrycodelist.json');
  }

  public getAllNormalUsers = (): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/users/getAllNormalUsers`);
  }

  public getUserTodoList = (createdBy): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/todos/${createdBy}/getAll`);
  }

  public getUserTodoDetail = (createdBy, todoId): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/todos/${createdBy}/getById/${todoId}`);
  }

  public createNewTodo = (todo): Observable<any> => {
    const params = new HttpParams()
                        .set('title', todo.title)
                        .set('list', JSON.stringify(todo.list))
                        .set('createdBy', todo.createdBy)
                        .set('modifiedBy', todo.modifiedBy)
                        .set('sharedWith', todo.sharedWith);
    return this.http.post(`${this.url}/api/v1/todos/create`, params);
  }

  public createNewVersionTodo = (todo): Observable<any> => {
    const params = new HttpParams()
                        .set('todoId', todo.todoId)
                        .set('title', todo.title)
                        .set('version', todo.version)
                        .set('status', todo.status)
                        .set('parentId', todo.parentId)
                        .set('list', JSON.stringify(todo.list))
                        .set('createdBy', todo.createdBy)
                        .set('modifiedBy', todo.modifiedBy)
                        .set('sharedWith', todo.sharedWith);
    return this.http.post(`${this.url}/api/v1/todos/update`, params);
  }

  public getUserTodoLastVersion = (userId, parentId, version): Observable<any> => {
    const params = new HttpParams()
                        .set('version', version)
                        .set('parentId', parentId);
    return this.http.post(`${this.url}/api/v1/todos/${userId}/getByParentId`, params);
  }

  public removeTodo = (todo): Observable<any> => {
    const params = new HttpParams()
                        .set('todoId', todo.todoId)
                        .set('parentId', todo.parentId);
    return this.http.post(`${this.url}/api/v1/todos/${todo.createdBy}/remove`, params);
  }


  // Friend Request Relations

  public sendFriendRequest = (senderId, receiverId): Observable<any> => {
    const params = new HttpParams()
                        .set('senderId', senderId)
                        .set('receiverId', receiverId);
    return this.http.post(`${this.url}/api/v1/relations/create`, params);
  }

  public acceptFriendRequest = (senderId, receiverId): Observable<any> => {
    const params = new HttpParams()
                        .set('senderId', senderId)
                        .set('receiverId', receiverId);
    return this.http.post(`${this.url}/api/v1/relations/accept`, params);
  }

  public rejectFriendRequest = (senderId, receiverId): Observable<any> => {
    const params = new HttpParams()
                        .set('senderId', senderId)
                        .set('receiverId', receiverId);
    return this.http.post(`${this.url}/api/v1/relations/reject`, params);
  }

  public getFriendList = (requestUserId): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/relations/${requestUserId}/getAll`);
  }

  public getPendingFriendList = (requestUserId): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/relations/${requestUserId}/getPending`);
  }
}
