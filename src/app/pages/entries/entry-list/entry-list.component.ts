
import { Component, OnInit } from '@angular/core';

// implemantação entry-list
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries.sort(( a , b ) => b.id - a.id), // itens retornados do web API
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteEntry(entry) {
    const mustDelete = confirm('Deseja realmente excluir esse item! '); // aviso delete;

    if ( mustDelete ) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element !== entry), // create new array
        () => alert('Erro ao tentar excluir!')
      );
    }
  }

}
