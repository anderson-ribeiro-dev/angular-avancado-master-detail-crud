import { CategoryService } from './../../categories/shared/category.service';
import { CategoryFormComponent } from './../../categories/category-form/category-form.component';


import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';

import { switchMap } from 'rxjs/operators'; // manipular as rotas

import toastr from 'toastr'; // mensagem formulário
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit,  AfterContentChecked {

  // propriedades
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null; // erro servidor
  submittingForm = false; // desabilita envio duplicado de requisão
  entry: Entry = new Entry;
  categories: Array<Category>;

  // máscaras
  imaskConfig = {
    mask: Number,
    scale: 2, // qtidade decimais
    thousandsSeparator: '', // separador de milhas
    padFractionalZeros: true, // adicionar os zeros
    normalizeZeros: true,
    radix: ',',
  };

  // idioma
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShorts: [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul',
      'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    // dependências
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    // ciclo componente
    this.setCurrentAction(); // acão
    this.buildEntryForm(); // construir form
    this.loadEntry(); // carregar categoria
    this.loadCategories(); // carregar array de categorias

  }

  ngAfterContentChecked() {
    this.setPageTitle(); // titulo da página

  }

  // click botão salvar
  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }

  }

  // métodos de despesa e receita
  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        };
      }
    );
  }

  // Privates Methods
  private setCurrentAction() {
    // monta o caminho da url
    if ( this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  // constrói formulários
  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      paid: [null, Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry); // binds loaded entry data to EntryForm
         },
         (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      );
    }
  }
 // array de categorias
  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private  setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry () {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value); // criar categoria nova
    this.entryService.create(entry)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          entry => this.actionsForSuccess(entry),
          error => this.actionsForError(error)
        );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          entry => this.actionsForSuccess(entry),
          error => this.actionsForError(error)
        );
  }

  private actionsForSuccess( entry: Entry) {
    toastr.success('Solicitação processada com sucesso!');
    // url depois do sucesso,skipLocationChange(não adiciona o histórico no navegador)
    // redirect/reload componet page
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação! ');
    this.submittingForm = false;

    if ( error.status === 422 ) {
      this.serverErrorMessages = JSON.parse(error._body).errors; // array de mensagens
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor, Por favor, tente mais tarde!'];
    }
  }

}
