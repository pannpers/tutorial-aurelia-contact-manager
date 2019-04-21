import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { WebAPI, Contact } from 'web-api';
import { RouteConfig } from 'aurelia-router';
import { areEqual } from 'utility';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactViewed, ContactUpdated } from 'message';

interface Params {
  id: string
}

@autoinject
export class ContactDetail {

  private readonly logger = getLogger(ContactDetail.name)

  routeConfig: RouteConfig;
  contact: Contact
  originalContact: Contact

  constructor(private api: WebAPI, private ea: EventAggregator) {}

  async activate(params: Params, routeConfig: RouteConfig) {
    this.routeConfig = routeConfig

    this.contact = await this.api.getContactDetails(params.id)
    this.routeConfig.navModel.setTitle(this.contact.firstName)
    // this.originalContact = JSON.parse(JSON.stringify(this.contact))
    this.originalContact = {...this.contact}

    this.ea.publish(new ContactViewed(this.contact))
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting
  }

  async save() {
    this.contact = await this.api.saveContact(this.contact)
    this.routeConfig.navModel.setTitle(this.contact.firstName)
    // this.originalContact = JSON.parse(JSON.stringify(this.contact))
    this.originalContact = {...this.contact}

    this.ea.publish(new ContactUpdated(this.contact))
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      const result = confirm('You have unsaved changes. Are you sure you wish to leave?')
      if (!result) {
        this.ea.publish(new ContactViewed(this.contact))
      }
      return result
    }
    return true
  }
}
