import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchReponse, Gif} from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  private _tagsHistory: string[] = [];
  private apiKey: string = '9sRmUi7HCk50jblcNpzwSn4IE5hyi04t';
  private serviceUrl: string = 'Http://api.giphy.com/v1/gifs';

  public gifList: Gif[] = [];


  constructor( private http:HttpClient) {
    this.loadLocalStorate();
    console.log('Saco datos del navegador');

   }

  get tagHistory(){
    return [...this._tagsHistory];
  }

  private saveLocalStorage ():void{
    localStorage.setItem('history2', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorate ():void{
    if (!localStorage.getItem('history2')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history2')!);

    this.searchTag (this._tagsHistory[0]);
  }

  private organizeHistory( tag: string){
    tag = tag.toLowerCase();

    if (this.tagHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter ( (oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift ( tag ) ;

    this._tagsHistory = this._tagsHistory.splice(0,10);

    this.saveLocalStorage();

  }


  public searchTag( tag:string ): void {

    const params = new HttpParams()
    .set ('api_key', this.apiKey)
    .set ('q', tag)
    .set ('limit', '10')

    if (tag.length === 0) return;

    this.organizeHistory(tag);

    this.http.get<SearchReponse>(`${ this.serviceUrl }/search`, { params })
    .subscribe ( resp => {
      this.gifList = resp.data
      console.log({ gif: this.gifList});
    })

  }


}

