import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { WebAPI, Contact } from 'web-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactViewed, ContactUpdated } from 'message';

@autoinject
export class ContactList {

  private readonly logger = getLogger(ContactList.name)
  contacts: Contact[]
  selectedId = 0

  constructor(private api: WebAPI, private ea: EventAggregator) {
    this.ea.subscribe(ContactViewed, msg => this.select(msg.contact))
    this.ea.subscribe(ContactUpdated, msg => {
      const id = msg.contact.id
      const found = this.contacts.find(c => c.id === id)
      Object.assign(found, msg.contact)
    })
  }



  created() {
    this.api.getContactList()
      .then(contacts => this.contacts = contacts)
  }

  select(contact: Contact) {
    this.selectedId = contact.id
    return true
  }
}
