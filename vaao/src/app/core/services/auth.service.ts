import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly key: string = 'vaao-user';

  constructor() { }

  addUser(user: User): void{
    localStorage.setItem(this.key, JSON.stringify(user))
  }

  getUser(): User {
    const user: User = JSON.parse(localStorage.getItem(this.key) ?? '{}') as User;
    if(user.idUser !== undefined && user.idUser > 0){
      switch(user.rol){
        case 1: user.rolDescription = 'Admin'; break;
        case 2: user.rolDescription = 'Supervisor'; break;
        case 3: user.rolDescription = 'Repartidor'; break;
        case 4: user.rolDescription = 'Cliente'; break;
      }
    }
    return user;
  }

  deleteUser() {
    localStorage.removeItem(this.key);
  }
}
