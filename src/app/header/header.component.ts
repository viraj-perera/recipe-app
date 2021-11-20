import { templateJitUrl } from "@angular/compiler";
import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector:'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
    
})
export class HeaderComponent {

    @Output() menuSelected = new EventEmitter<string>();

    selectedMenu:string;

    // onSelectMenu(menuItem:string){
    //     console.log('Fired Header: onSelectMenu');
    //     this.menuSelected.emit(menuItem);
    // }

}