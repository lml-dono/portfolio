/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.astro" {
  const Component: any;
  export default Component;
}

declare module "../components/ProjectGrid.astro" {
  const Component: any;
  export default Component;
}

declare module "../components/ProjectGrid" {
  const Component: any;
  export default Component;
}
