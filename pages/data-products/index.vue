<template lang="pug">
v-layout(column)
  v-btn(@click='goToAddProduct').align-self-start 
    v-icon mdi-plus
    | Tambah Produk
  v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
  v-data-table(:headers='headers', :items='filteredItems', hide-default-footer)
    v-progress-linear(slot='progress', color='primary', indeterminate)
    template(v-slot:item.name="{item}")
      td
        p.max {{item.name}}
    template(v-slot:item.image="{item}")
      td
        img.mx-3(:src='item.image', alt='product', height='100')
    template(v-slot:item.price="{item}")
      td Rp {{Intl.NumberFormat('id').format(item.price)}}
    template(v-slot:item.shelf="{item}")
      td
        .map-button(@click='handleMap(item.shelf)', style='cursor: pointer')
          v-icon(large, color="blue darken-2") mdi-map-marker
          span.blue--text Lihat lokasi
    template(v-slot:item.edit='{item}')
      td
        v-btn(@click='goToManageProduct(item)')
          v-icon mdi-pencil
        v-btn( @click='goToDeleteForm(item)').mx-3
          v-icon(color='error') mdi-delete
  manage-product-form(v-model='openManageForm', :product='selectedProduct' :closeForm='closeForm')
  v-dialog(v-model='openDeleteForm', width='400')
    v-card.text-center.py-3.px-3
      p Apakah anda ingin menghapus {{selectedProductToDelete.name }} ? {{selectedProductToDelete.kode_produk}}
      v-btn.mr-3(color='primary' @click='proceedToDelete') Ya
      v-btn(color='secondary' @click='openDeleteForm = false') Tidak
  v-dialog(v-model='openDeletedForm', width='400')
    v-card.text-center.py-3.px-3
      p Produk {{selectedProductToDelete.name }} {{selectedProductToDelete.kode_produk}} Berhasil dihapus.
      v-btn(color='secondary' @click='openDeletedForm = false') Oke
</template>


<script>
import firebase from '../../plugins/firebase'
import ManageProductForm from '/components/ManageProductForm';

export default {
  name: 'AdminDataProducts',
  components: {
    ManageProductForm,
  },
  mounted(){
    if (!this.$store.getters['getAdminStatus']) {
      this.$toast.error('Kamu tidak memiliki akses halaman ini');
      this.$router.push('/')
    }
    this.getData()
  },
  data(){

    return{
      openManageForm: false,
      openDeleteForm: false,
      selectedProduct: {},
      selectedProductToDelete: {},
      openDeletedForm: false,
      items: [
        {
          kode_produk: 'BR00121',
          name: 'Blue Band',
          brand: 'Unilever',
          price: '15000',
          status: 'Ada',
          stock: 21,
        },
      ],
      searchValue: '',
      headers: [
        {text: 'Kode Produk', value: 'kode_produk'},
        {text: 'Gambar', value: 'image'},
        {text: 'Nama Produk', value: 'name'},
        {text: 'Brand', value: 'brand'},
        {text: 'Harga', value: 'price'},
        {text: 'Status', value: 'status'},
        {text: 'Stock', value: 'stock'},
        {text: 'Lokasi', value: 'shelf'},
        {text: 'Edit', value: 'edit'},
      ].map(data => ({...data, sortable: false})),
    }
  },
  computed: {
    filteredItems: function(){
      return this.items.filter((item) => {
        return item.name.match(this.searchValue) || item.kode_produk.match(this.searchValue)
      });
    },
  },
  methods: {
    goToManageProduct(item = {}){
      // edit modal
      this.selectedProduct = item;
      this.openManageForm = true;
    },
    goToAddProduct(){
      // modal tambah produk
      this.openManageForm = true;
    },
    goToDeleteForm(item){
      // set hapus produk
      this.selectedProductToDelete = item;
      this.openDeleteForm = true;
    },
    async closeForm(kode = null){
      if(kode){
        this.selectedProduct = {};
      }else{
        await firebase.database().ref('products')
        .once('value', (snapshot) => {
          const object = snapshot.val();

          if (object) {
            const list = Object.keys(object).map((key) => ({
              ...object[key],
              cid: key,
            }));
            
            // buat kode automatis
            let kodeProduk = 'KP00001'
            const urutan = parseInt(list[list.length - 1]?.kode_produk.substr(2, 5))
            const kodeUrut = urutan + 1
            if (kodeUrut.toString().length === 2) {
              kodeProduk = `KP000${kodeUrut}`
            } else if (kodeUrut.toString().length === 3) {
              kodeProduk = `KP00${kodeUrut}`
            } else if (kodeUrut.toString().length === 4) {
              kodeProduk = `KP0${kodeUrut}`
            } else if (kodeUrut.toString().length === 5) {
              kodeProduk = `KP${kodeUrut}`
            } else {
              kodeProduk = `KP0000${kodeUrut}`
            }
            this.selectedProduct = {
              kode_produk: kodeProduk,
            };
          }
        });
      }
      this.openManageForm = false;
    },
    async proceedToDelete(){
      // hapus product
      this.items = this.items.filter(item => item.kode_produk !== this.selectedProductToDelete.kode_produk)
      await firebase.database().ref(`products/${this.selectedProductToDelete.id}`).remove();
      this.selectedProductToDelete = {};
      this.openDeleteForm = false;
      this.openDeletedForm = true;
      this.getData()
    },
    searchProduct(e){
      this.searchValue = e
    },
    handleMap(rak){
      // cari produk di rak
      this.$router.push({ path: '/map', query: { rak } })
    },
    async getData(){
      await firebase.database().ref('products')
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          const list = Object.keys(object).map((key) => ({
            ...object[key],
            cid: key,
          }));
          this.items = list
        }
      });
    },
  },
};
</script>

<style scoped>
  .max{
    max-width: 13rem!important
  }
</style>