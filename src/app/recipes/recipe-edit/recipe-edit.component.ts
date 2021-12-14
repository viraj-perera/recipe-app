import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id:number;
  editMode:boolean = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService:RecipeService, private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        this.id = +params['id'];
        this.editMode = (params['id'] != null);
        this.initForm();
      }
    );
  }

  clearForm(){    
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  deleteForm(){
    console.log('Delete form called.');
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'], {relativeTo:this.route});  
  }

  initForm(){
    let recipeName = '';
    let recipeDescription = '';
    let imagePath = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      console.log(recipe);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      imagePath = recipe.imagePath;
      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount':new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup(
      {
        'name': new FormControl(recipeName, Validators.required),
        'description': new FormControl(recipeDescription, Validators.required),
        'imagePath': new FormControl(imagePath, Validators.required),
        'ingredients': recipeIngredients
      }
    );

  }

  onSubmit(){
    console.log(this.recipeForm);
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    // );
    if(this.editMode){
      this.recipeService.editRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.clearForm();
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredients(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount':new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }


}
