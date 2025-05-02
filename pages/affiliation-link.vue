<script setup lang="ts">
const route = useRoute()

navigateTo({ ...route, name: 'purchase-link' } as typeof route, { redirectCode: 301 })
</script>
