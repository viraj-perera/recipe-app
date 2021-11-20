import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipe-app';
  selectedMenu:string = 'recipes';

  onSelectedMenu(selectedMenu:string){
    console.log('Selected : '+selectedMenu);
    this.selectedMenu = selectedMenu;
  }
}
