import { Entry } from './entry.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

private apiPath = 'api/entries';

  constructor( private http: HttpClient) { }

  // métodos
  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries) // retorno Api
    );
  }

  getById(id: number): Observable<Entry> {
    // requisão
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  create ( entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry) // retorna entry
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // methods private
  // converte o json do servidor em um array
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    // console.log(jsonData[0] as Entry);
    // console.log( Object.assign(new Entry(), jsonData[0]) );
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element); // trás um objeto
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return  Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisão! => ', error);
    return throwError(error);
  }
}
