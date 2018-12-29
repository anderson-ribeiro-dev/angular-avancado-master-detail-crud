

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
  serverErrorMessagens: string[] = null; // erro servidor
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
      descripton: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById( + params.get('id')))
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

  private  setPageTitle(){
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Ctegoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

}
