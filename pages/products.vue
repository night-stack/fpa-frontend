<template lang="pug">
  v-layout(column)
    v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
    v-card.card-light.mx-auto.mb-3(min-width='1000px', max-width='1000px', tile, v-for='item in filteredItems')
      v-list-item-content
        v-row.justify-space-between.px-6.py-6(row, nowrap)
          v-col.card-image.flex-grow-0(style='flex-basis: 300px' col='3')
            img.mx-3(:src='item.image', alt='product', height='200')
          v-col.item-description-container(col='9')
            h4.display-1 {{item.name}} || {{item.brand}}
            p #[b Rp {{Intl.NumberFormat('id').format(item.price)}} ]
            .item-info
              //span Stock: {{item.stock}}
              span &nbsp; Status: {{item.status === 'available' ? 'Tersedia' : 'Kosong'}}
              span &nbsp; Lokasi: RAK {{item.shelf}}
      .map-button
        v-icon(large, color="blue darken-2") mdi-map-marker
        span.blue--text(@click='goTo(item.shelf)') Lihat lokasi
    
</template>

<script>
import firebase from '../plugins/firebase'

export default {
  name: 'ProductsPage',
  // components: {
  //   searchValue: '',
  // },
  mounted() {
    this.getData()
  },
  data() {
    return{
      products: [],
      searchValue: '',
    }
  },
  computed: {
    filteredItems: function(){
      return this.products.filter((item) => {
        return item.name.match(this.searchValue) || item.kode_produk.match(this.searchValue)
      });
    },
  },
  methods: {
    searchProduct(e){
      this.searchValue = e
    },
    getData() {
      firebase.database().ref('products')
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          const list = Object.keys(object).map((key) => ({
            ...object[key],
            cid: key,
          }));
          this.products = list
          
        }
      });
    },

    goTo(rak){
      // cari rak
      this.$router.push({ path: '/map', query: { rak } })
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