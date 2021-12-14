import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients:Ingredient[];
  igChangedSubscription:Subscription;

  constructor(private shoppingListService:ShoppingListService) { }
  ngOnDestroy(): void {
    this.igChangedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangedSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (changedIngredients:Ingredient[]) => {
        this.ingredients = changedIngredients;
      }
    );
  }

  onEditItem(index:number){
    this.shoppingListService.startedEditing.next(index);
  }

}
