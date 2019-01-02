

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';

import { switchMap } from 'rxjs/operators'; // manipular as rotas

import toastr from 'toastr'; // mensagem formulário

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit,  AfterContentChecked {

  // propriedades
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null; // erro servidor
  submittingForm = false; // desabilita envio duplicado de requisão
  category: Category = new Category;

  constructor(
    // dependências
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // ciclo componente
    this.setCurrentAction(); // acão
    this.buildCategoryForm(); // construir form
    this.loadCategory(); // carregar categoria

  }

  ngAfterContentChecked() {
    this.setPageTitle(); // titulo da página

  }

  // click botão salvar
  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }

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

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category); // binds loaded category data to CategoryForm
         },
         (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      );
    }
  }

  private  setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory () {
    const category: Category = Object.assign(new Category(), this.categoryForm.value); // criar categoria nova
    this.categoryService.create(category)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          category => this.actionsForSuccess(category),
          error => this.actionsForError(error)
        );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          category => this.actionsForSuccess(category),
          error => this.actionsForError(error)
        );
  }

  private actionsForSuccess( category: Category) {
    toastr.success('Solicitação processada com sucesso!');
    // url depois do sucesso,skipLocationChange(não adiciona o histórico no navegador)
    // redirect/reload componet page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
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
