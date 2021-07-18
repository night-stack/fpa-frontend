<template lang="pug">
  v-layout(column)
    author-card(title='KAMROZI', avatarURL='/profile1.jpg',description='Tempat tanggal lahir : MEDAN,14 juni 2000')
    author-card.mt-3(title='Januari Sihombing', avatarURL='/profile2.jpg',description='Tempat tanggal lahir: Mela, 01 Januari 1998')

</template>

<script>
import AuthorCard from '~/components/AuthorCard.vue';

export default {
  name: 'AboutUs',
  components: {
    AuthorCard,
  },
}
</script>
