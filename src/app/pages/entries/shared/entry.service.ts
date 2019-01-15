
import { CategoryService } from './../../categories/shared/category.service';
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

  constructor( private http: HttpClient, private categoryService: CategoryService) { }

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
  // Observable<Observable<entry>> // relacionamento categoria/categoriaId
   return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        // Observable<entry>
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        );
      })
    );

    // return this.http.post(this.apiPath, entry).pipe(
    //   catchError(this.handleError),
    //   map(this.jsonDataToEntry)
    // );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    // atualizar category, categoryId
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry) // retorna entry
        );
      })
    );
    // return this.http.put(url, entry).pipe(
    //   catchError(this.handleError),
    //   map(() => entry) // retorna entry
    // );
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
