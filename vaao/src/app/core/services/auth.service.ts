import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../shared/interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly key = 'vaao-user';

  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  /** LOGIN */
  addUser(user: User): void {
    this.setRolDescription(user);
    localStorage.setItem(this.key, JSON.stringify(user));
    this.userSubject.next(user); // 🔥 NOTIFICA
  }

  /** LOGOUT */
  deleteUser(): void {
    localStorage.removeItem(this.key);
    this.userSubject.next(null); // 🔥 NOTIFICA
  }

  /** USO INTERNO */
  private loadUser(): User | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;

    const user: User = JSON.parse(raw);
    if (!user.idUser) return null;

    this.setRolDescription(user);
    return user;
  }

  private setRolDescription(user: User) {
    switch (user.rol) {
      case 1: user.rolDescription = 'Admin'; break;
      case 2: user.rolDescription = 'Supervisor'; break;
      case 3: user.rolDescription = 'Repartidor'; break;
      case 4: user.rolDescription = 'Cliente'; break;
    }
  }

  /** ACCESO DIRECTO (opcional) */
  getUser(): User | null {
    return this.userSubject.value;
  }
}
