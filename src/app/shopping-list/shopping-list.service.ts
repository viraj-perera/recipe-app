import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {

    deleteIngredient(editedItemIndex: number) {
      this.ingredients.splice(editedItemIndex, 1);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private   ingredients:Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
        new Ingredient('Bread', 1),
      ];

    getIngredients(){
        return this.ingredients.slice();
    }
    
    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    getIngredient(index: number): Ingredient {
        return this.ingredients[index];
      }
    
    updateIngredient(index:number, updatedIngredient:Ingredient){
        this.ingredients[index] = updatedIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}