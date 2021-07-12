<template lang="pug">
.author-card
  v-card.mx-auto(max-width='1000px')
    v-list-item()
      v-list-item-avatar(tile size='200' color='grey')
        v-img(:src='avatarURL')
      v-list-item-content
        v-list-item-title.headline.mb-1
          | {{title}}
        p {{description}}
  
</template>

<script>

export default {
    name: 'AuthorCard',
    props: {
      avatarURL: {
        type: String,
        default: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      },
      title: {
        type: String,
        default: "Card Title",
      },
      description: {
        type: String,
        default: "Pemilik Website",
      },
    },
}
</script>

<style scoped>
    /* .author-card{
        background-color: white;
    } */
</style>
