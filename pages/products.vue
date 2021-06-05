<template lang="pug">
  v-layout(column)
    v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
    v-card.card-light.mx-auto.mb-3(min-width='1000px', tile, v-for='i in 4')
      v-list-item-content
        v-row.justify-space-between.px-6.py-6(row, nowrap)
          v-col.card-image.flex-grow-0(style='flex-basis: 300px' col='3')
            img.mx-3(:src='`/product-${ i }.jpg`', alt='product', height='200')
          v-col.item-description-container(col='9')
            h4.display-1 Blue Band 250 gram || Unilever
            p #[b Rp 10.000 ]
            .item-info
              span Stock: 0
              span &nbsp; Status: Kosong
              span &nbsp; Lokasi: RAK A
      .map-button
        v-icon(large, color="blue darken-2") mdi-map-marker
        span.blue--text Lihat lokasi
    
</template>

<script>

export default {
  name: 'ProductsPage',
  components: {
    searchValue: '',
  },
  methods: {
    searchProduct(e){

    },
  },
}
</script>


<style scoped>
  .card-light{
    background: #efefef !important;
    color: #222 !important;
    position: relative;
  }
  .item-description-container{
    position: relative;

  }
  .item-description-container > .item-info {
    bottom: 0;
    position: absolute;
  }
  .map-button{
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>