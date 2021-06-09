<template lang="pug">
v-layout(column)
  v-btn(@click='goToManageProduct').align-self-start 
    v-icon mdi-plus
    | Tambah Produk
  v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
  v-data-table(:headers='headers', :items='items', hide-default-footer)
    v-progress-linear(slot='progress', color='primary', indeterminate)
    template(v-slot:item.lokasi="{item}")
      td
        .map-button(@click='handleMap', style='cursor: pointer')
          v-icon(large, color="blue darken-2") mdi-map-marker
          span.blue--text Lihat lokasi
    template(v-slot:item.edit='{item}')
      td
        v-btn(@click='goToManageProduct(item)')
          v-icon mdi-pencil
        v-btn( @click='goToDeleteForm(item)').mx-3
          v-icon(color='error') mdi-delete
  manage-product-form(v-model='openManageForm', :product='selectedProduct')
  v-dialog(v-model='openDeleteForm', width='400')
    v-card.text-center.py-3.px-3
      p Apakah anda ingin menghapus {{selectedProductToDelete.nama }} ? {{selectedProductToDelete.kode_produk}}
      v-btn.mr-3(color='primary' @click='proceedToDelete') Ya
      v-btn(color='secondary' @click='openDeleteForm = false') Tidak
  v-dialog(v-model='openDeletedForm', width='400')
    v-card.text-center.py-3.px-3
      p Produk {{selectedProductToDelete.nama }} {{selectedProductToDelete.kode_produk}} Berhasil dihapus.
      v-btn(color='secondary' @click='openDeletedForm = false') Oke
</template>


<script>
import ManageProductForm from '/components/ManageProductForm';

export default {
  name: 'AdminDataProducts',
  components: {
    ManageProductForm,
  },
  mounted(){
    if (!this.$store.getters['isAdmin']) {
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
          nama: 'Blue Band',
          brand: 'Unilever',
          harga: '15000',
          status: 'Ada',
          stock: 21,
        },
      ],
      searchValue: '',
      headers: [
        {text: 'Kode Produk', value: 'kode_produk'},
        { text: 'Nama Produk', value: 'nama'},
        {text: 'Brand', value: 'brand'},
        {text: 'Harga', value: 'harga'},
        {text: 'Status', value: 'status'},
        {text: 'Stock', value: 'stock'},
        {text: 'Lokasi', value: 'lokasi'},
        {text: 'Edit', value: 'edit'},
      ].map(data => ({...data, sortable: false})),
    }
  },
  methods: {
    goToManageProduct(item = {}){
      this.selectedProduct = item;
      this.openManageForm = true;
    },
    goToDeleteForm(item){
      this.selectedProductToDelete = item;
      this.openDeleteForm = true;
    },
    proceedToDelete(){
      this.items = this.items.filter(item => item.kode_produk !== this.selectedProductToDelete.kode_produk)
      this.openDeleteForm = false;
      this.openDeletedForm = true;
    },
    searchProduct(e){

    },
    handleMap(e){
      
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
</style>