<template lang="pug">
  v-layout(column)
    author-card(title='Nama1', avatarURL='/profile1.jpg')
    author-card.mt-3(title='Nama2', avatarURL='/profile2.jpg')

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
