import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  sourceRecipe:Recipe;
  id: number;

  constructor(private recipeService:RecipeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.sourceRecipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  onAddToShoppingList(){
    
    this.recipeService.addIngredientsToShoppingList(this.sourceRecipe.ingredients);
  }

}
