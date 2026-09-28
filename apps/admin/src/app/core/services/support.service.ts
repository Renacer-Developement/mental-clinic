import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SupportService {
  readonly panelOpen = signal(false);
  open()   { this.panelOpen.set(true); }
  close()  { this.panelOpen.set(false); }
  toggle() { this.panelOpen.update(v => !v); }
}
