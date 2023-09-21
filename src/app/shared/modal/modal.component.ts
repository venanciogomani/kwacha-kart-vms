import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() isOpen: boolean = false;
    @Output() isOpenChange = new EventEmitter<boolean>();

    closeModal() {
        this.isOpen = false;
        this.isOpenChange.emit(this.isOpen);
    }
}
