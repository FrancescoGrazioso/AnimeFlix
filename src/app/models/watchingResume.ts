import {DocumentData} from '@angular/fire/firestore';

export class WatchingResume {
  uid: string;
  animeTitle: string;
  videoUrl: string;
  index: number;
  currentTime: number;

  constructor(doc: DocumentData) {
    this.uid = doc.uid;
    this.animeTitle = doc.animeTitle;
    this.videoUrl = doc.videoUrl;
    this.index = doc.index;
    this.currentTime = doc.currentTime;
  }
}
