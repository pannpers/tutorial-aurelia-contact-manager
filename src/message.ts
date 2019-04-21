import { Contact } from 'web-api';

export class ContactUpdated {
  constructor(public contact: Contact) {}
}

export class ContactViewed {
  constructor(public contact: Contact) {}
}
