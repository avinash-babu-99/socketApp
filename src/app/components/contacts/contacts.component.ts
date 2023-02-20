import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Input() contactsList = [1, 2, 3]

  constructor() { }

  ngOnInit(): void {
  }

}
