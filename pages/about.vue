<template lang="pug">
  v-layout(column)
    author-card(title='KAMROZI', avatarURL='/profile1.jpg',description='lalala')
    author-card.mt-3(title='Januari Sihombing', avatarURL='/profile2.jpg',description='Pemilik website')

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
