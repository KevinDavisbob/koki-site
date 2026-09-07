<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>
<template><main class="content-page"><header class="page-intro"><p class="eyebrow">KOKI / 2026</p><h1>{{ title }}</h1><p>{{ description }}</p></header><div class="page-body"><slot /></div></main></template>
