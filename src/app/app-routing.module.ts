import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoPlayerComponent} from './components/video-player/video-player.component';
import {HomeComponent} from './components/home/come.component';
import {SearchComponent} from './components/search/search.component';
import {LoadPlayerComponent} from './components/load-player/load-player.component';
import {UserComponent} from './components/user/user.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {UserGuard} from './guards/user.guard';
import {ComingSoonComponent} from './components/coming-soon/coming-soon.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'player', component: VideoPlayerComponent},
  {path: 'search', component: SearchComponent},
  {path: 'loadPlayer', component: LoadPlayerComponent},
  {path: 'user', component: UserComponent, canActivate: [UserGuard]},
  {path: 'signIn', component: LoginComponent},
  {path: 'signUp', component: RegisterComponent},
  {path: 'comingSoon', component: ComingSoonComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
