import { createRouter, ParseRoute } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
});

export type RouterPath = ParseRoute<typeof routeTree>['fullPath'];

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { router };
