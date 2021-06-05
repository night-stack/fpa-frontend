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
        default: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque eveniet cum odio veniam, ipsa voluptas a quia dolorem! Qui repudiandae labore optio nobis itaque ducimus ut, atque tempora aspernatur impedit.
Magnam aperiam quibusdam quidem! Doloribus magnam aliquam velit repudiandae provident aperiam dicta earum quam cupiditate molestiae nobis porro quos facere eos culpa, a blanditiis reprehenderit pariatur quasi! Soluta, ab aliquid.
Ducimus ex voluptatem cum repellendus eum facilis fugiat voluptatibus perspiciatis incidunt sunt. Sint, iusto. Odit eius omnis, incidunt sint dolor porro eveniet, reprehenderit velit ea quos, impedit placeat tempore consectetur.
Officiis, rem est. Dolor, totam eaque voluptate natus numquam, voluptatem sit sequi recusandae esse a tempore illo nesciunt, hic nostrum? Laboriosam, cumque possimus fuga ipsam assumenda quasi itaque adipisci dolores.
Expedita placeat animi ducimus fuga corporis cum nihil. Quasi voluptate nulla suscipit nobis nihil necessitatibus deleniti ad, rerum laboriosam tempora sed quia in esse atque dolor repellat omnis nisi amet.`,
      },
    },
}
</script>

<style scoped>
    /* .author-card{
        background-color: white;
    } */
</style>
