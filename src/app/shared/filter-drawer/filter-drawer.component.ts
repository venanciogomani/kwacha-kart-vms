import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss']
})
export class FilterDrawerComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  closeModal() {
      this.isOpen = false;
      this.isOpenChange.emit(this.isOpen);
  }
}
