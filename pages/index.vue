<template lang="pug">
v-layout(column)
  img(src='/home-banner.jpg')
  v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
  v-btn.align-self-end.my-3.text-xs-right(@click='goToProducts', color='primary', depressed) Lihat Semua
  vue-slick-carousel(v-if='filteredItems.length > 0' cssEase='ease' :infinite='false', :draggable='true' lazyLoad='ondemand' :slidesToShow='3' :arrows='true' :dots='true')
    v-card.text-center.card-light.mr-1(v-for='i in filteredItems' :key='i.id')
      img.mx-3(:src='i.image', height='200px' alt='product')
      v-list-item-content.text-left.ml-3
        v-list-item-title.headline.mb-1
          | {{i.name}}
        p #[b Rp {{Intl.NumberFormat('id').format(i.price)}} ]
  hr.mt-8
  h4.display-0.text-center Terima kasih atas kunjunganya
</template>

<script>
import firebase from '../plugins/firebase'
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import numberHelper from  '~/mixins/number-helper';
import {mapGetters} from 'vuex'

export default {
  name: 'Index',
  mixins: [numberHelper],
  components: {
    VueSlickCarousel,
  },
  mounted() {
    this.getData()
  },
  data() {
    return {
      searchValue: '',
      products: [],
    };
  },
  computed: {
    ...mapGetters({
      username: 'getUsername',
    }),
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
    goToProducts(){
      this.$router.push('/products');
    },
    async getData() {
      await firebase.database().ref('products').limitToFirst(9)
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          const list = Object.keys(object).map((key) => ({
            ...object[key],
          }));
          this.products = list.reverse()
        }
      });
    },
  },
};
</script>

<style>
  /* the slides */
  .slick-slide {
    margin-right: 5px;
  }
  .slick-track, .slick-list{
    max-height: 300px;
  }
  .slick-dots li button:before{
   color: #eee; 
  }
  .slick-dots li.slick-active button:before{
   color: white; 
  }
  .card-light{
    background: #efefef !important;
    color: #222 !important;
  }
</style>