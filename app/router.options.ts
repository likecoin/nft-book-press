import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  routes: (routes) => {
    const modifiedRoutes = [...routes]

    // Add an edit page using the same component as new page
    const nftBookStoreRoute = modifiedRoutes.find(r => r.path === '/nft-book-store')
    nftBookStoreRoute?.children?.push({
      name: 'nft-book-store-status-editingClassId-edit-editionIndex',
      path: '/nft-book-store/status/:editingClassId/edit/:editionIndex',
      component: () => import('~/pages/nft-book-store/new.vue').then(r => r.default || r)
    })

    return modifiedRoutes
  }
}
