import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SoonGuard implements CanActivate {
  isAdmin = false;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(
      observe => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && this.auth.getFirebaseUser()) {
          this.auth.isAdmin().subscribe(
            (data) => {
              for (const admin of data) {
                if (user.email === admin.payload.val()) {
                  this.isAdmin = true;
                  break;
                }
              }

              if (!this.isAdmin) {
                this.firestore.collection('betaTester').doc(user.email).get().toPromise().then(
                  (datas) => {
                    if (datas.exists) {
                      this.isAdmin = true;
                      observe.next(this.isAdmin);
                      observe.complete();
                    } else {
                      this.router.navigate(['signIn']);
                    }
                  }
                );
              } else {
                observe.next(this.isAdmin);
                observe.complete();
              }
            });
          } else {
          this.router.navigate(['signIn']);
        }
      });
  }

}
