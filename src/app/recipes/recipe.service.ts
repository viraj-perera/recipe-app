import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {

    getRecipe(index: number): Recipe {
      return this.recipes[index];
    }

    recipeSelected = new EventEmitter<Recipe>();

    private recipes:Recipe[] = [
        new Recipe('Tasty Schnitzel', 
        'A super taste schnitzel - worth for price!', 
        'https://cdn.pixabay.com/photo/2019/03/25/20/20/schnitzel-4081269_960_720.jpg', 
        [
            new Ingredient('Meat', 1),
            new Ingredient('French fries', 15),
        ]),
        new Recipe('A Big fat burger', 
        'What else do you need to say?', 
        'https://cdn.pixabay.com/photo/2019/11/09/17/02/burger-4614022_960_720.jpg', 
        [
            new Ingredient('Bun', 2),
            new Ingredient('Meat', 1),
        ])
      ];

    
    constructor(private slService:ShoppingListService){}

    getRecipes(){
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
    
}