import { computed, Directive, inject, input } from '@angular/core';
import { ClinicContactsService } from '../../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../../shared/constants/contacts.constants';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { SERVICES, ServiceContent } from '../services.data';

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

/**
 * What every service layout shares: the content, its phone line, the other
 * services and in-page jumps. Each page draws its own markup on top of this,
 * so the five pages don't look like one template.
 */
@Directive()
export abstract class ServiceLayout {
  private readonly contacts = inject(ClinicContactsService);

  protected readonly ROUTES = ROUTES;

  readonly service = input.required<ServiceContent>();

  readonly related = computed(() => SERVICES.filter(s => s.slug !== this.service().slug));
  readonly phone = computed(() => {
    const p = clinicContacts[this.service().line].phone;
    return { href: 'tel:' + p, text: formatPhone(p) };
  });

  /** href for an in-page anchor that still works without JS */
  anchor(id: string): string {
    return `/${this.service().slug}#${id}`;
  }

  jump(event: Event, id: string): void {
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // <base href="/"> would resolve a bare '#id' against the site root
    history.replaceState(null, '', location.pathname + '#' + id);
  }

  openContacts(): void {
    this.contacts.openDialog(clinicContacts, 'service-page');
  }
}
