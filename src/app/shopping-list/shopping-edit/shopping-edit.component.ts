import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static:false}) form:NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    console.log('onAddingIngredient() fired.');
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if(this.editMode){
      console.log(newIngredient);
      this.shoppingListService.updateIngredient(this.editedItemIndex,newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.form.reset();
  }

  onDeleteIngredient() {
    console.log('onAddingIngredient() fired.');
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onReset();
  }

  onReset() {
    console.log('onAddingIngredient() fired.');
    this.editMode = false;
    this.form.reset();
  }
}
