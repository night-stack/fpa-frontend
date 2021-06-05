<template lang="pug">
v-layout(column)
  img(src='/home-banner.jpg')
  v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
  v-btn.align-self-end.my-3.text-xs-right(@click='goToProducts', color='primary', depressed) Lihat Semua
  vue-slick-carousel(cssEase='ease' :infinite='false', :draggable='true' lazyLoad='ondemand' :slidesToShow='3' :arrows='true' :dots='true')
    v-card.text-center.card-light.mr-1(v-for='i in 6' :key='"product" + i')
      img.mx-3(:src='`/product-${ ((i-1) % 4) + 1}.jpg`', height='200px' alt='product')
      v-list-item-content.text-left.ml-3
        v-list-item-title.headline.mb-1
          | Nama Product
        p #[b Rp. 0 ]
  hr.mt-8
  h4.display-0.text-center Terima kasih atas kunjunganya
</template>

<script>
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
  data() {
    return {
      searchValue: '',
    };
  },
  computed: {
    ...mapGetters({
      username: 'getUsername',
    }),
  },
  methods: {
    searchProduct(){
      
    },
    goToProducts(){
      this.$router.push('/products');
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