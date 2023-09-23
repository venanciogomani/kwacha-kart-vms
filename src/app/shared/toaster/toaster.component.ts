import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {
    @Input() isOpen: boolean = false;
    @Output() isOpenChange = new EventEmitter<boolean>();

    closeModal() {
        this.isOpen = false;
        this.isOpenChange.emit(this.isOpen);
    }
}
