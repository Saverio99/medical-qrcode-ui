import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // the whole app is rendered in the browser:
    // - dashboard needs localStorage (authGuard)
    // - emergency/:id loads dynamic data from the backend
    path: '**',
    renderMode: RenderMode.Client
  }
];
