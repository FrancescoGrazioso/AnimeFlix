import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoPlayerComponent} from './components/video-player/video-player.component';
import {HomeComponent} from './components/home/come.component';
import {SearchComponent} from './components/search/search.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'player', component: VideoPlayerComponent},
  {path: 'search', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
