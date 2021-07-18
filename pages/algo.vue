<template lang="pug">
v-layout(column)
  v-btn(@click='goToAddProduct').align-self-start 
    | Cari Produk
  v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
  v-data-table(:headers='headers', :items='filteredItems')
    v-progress-linear(slot='progress', color='primary', indeterminate)
    template(v-slot:item.nama="{item}")
      td
        p.max {{item.nama}}
    template(v-slot:item.harga_toko="{item}")
      td Rp {{Intl.NumberFormat('id').format(item.harga_toko)}}
    template(v-slot:item.id_rak="{item}")
      td
        p(v-if='item.id_rak === 1').max A
        p(v-if='item.id_rak === 2').max B
        p(v-if='item.id_rak === 3').max C
        p(v-if='item.id_rak === 4').max D
        p(v-if='item.id_rak === 5').max E
        p(v-if='item.id_rak === 6').max F
        p(v-if='item.id_rak === 7').max G
        p(v-if='item.id_rak === 8').max H
        p(v-if='item.id_rak === 9').max I
        p(v-if='item.id_rak === 10').max J
        p(v-if='item.id_rak === 11').max K
        p(v-if='item.id_rak === 12').max L
        p(v-if='item.id_rak === 13').max M
        p(v-if='item.id_rak === 14').max N
        p(v-if='item.id_rak === 15').max O
        p(v-if='item.id_rak === 16').max P
        p(v-if='item.id_rak === 17').max Q
        p(v-if='item.id_rak === 18').max R
        p(v-if='item.id_rak === 19').max S
        p(v-if='item.id_rak === 20').max T
        p(v-if='item.id_rak === 21').max U
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

  //- v-card.mt-5
  //-   p
  //-       strong Hasil Precision dari RAK A adalah : 
  //-   p {{this.a && this.a.count}} / ({{this.a && this.a.produts}} - {{this.a && this.a.count}}) * 100 = {{this.a && this.a.precision}} %
  //-   p 
  //-       strong Hasil Precision dari RAK B adalah : 
  //-   p {{this.b && this.b.count}} / ({{this.b && this.b.produts}} - {{this.b && this.b.count}}) * 100 = {{this.b && this.b.precision}} %
  //-   p     
  //-       strong Hasil Precision dari RAK C adalah :
  //-   p {{this.c && this.c.count}} / ({{this.c && this.c.produts}} - {{this.c && this.c.count}}) * 100 = {{this.c && this.c.precision}} %
  //-   p     
  //-       strong Hasil Precision dari RAK D adalah :
  //-   p {{this.d && this.d.count}} / ({{this.d && this.d.produts}} - {{this.d && this.d.count}}) * 100 = {{this.d && this.d.precision}} %

  //- v-card.mt-5
  //-   p
  //-       strong Hasil Recall dari RAK A adalah : 
  //-   p {{this.a && this.a.count}} / {{this.a && this.a.produts}} * 100 = {{this.a && this.a.recall}} %
  //-   p 
  //-       strong Hasil Recall dari RAK B adalah : 
  //-   p {{this.b && this.b.count}} / {{this.b && this.b.produts}} * 100 = {{this.b && this.b.recall}} %
  //-   p     
  //-       strong Hasil Recall dari RAK C adalah :
  //-   p {{this.c && this.c.count}} / {{this.c && this.c.produts}} * 100 = {{this.c && this.c.recall}} %
  //-   p     
  //-       strong Hasil Recall dari RAK D adalah :
  //-   p {{this.d && this.d.count}} / {{this.d && this.d.products}} * 100 = {{this.d && this.d.recall}} %

  //- v-card.mt-5
  //-   p
  //-       strong Hasil Akurasi dari RAK A adalah : 
  //-   p {{this.a && this.a.count}} + {{this.a && this.b && this.c && this.d && (this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)}} / {{this.items.length}} * 100 = {{this.a && this.b && this.c && this.d && (this.a.count+(this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)/this.items.length*100)}} %
  //-   p 
  //-       strong Hasil Akurasi dari RAK B adalah : 
  //-   p {{this.b && this.b.count}} + {{this.a && this.b && this.c && this.d && (this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)}} / {{this.items.length}} * 100 = {{this.a && this.b && this.c && this.d && (this.b.count+(this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)/this.items.length*100)}} %
  //-   p     
  //-       strong Hasil Akurasi dari RAK C adalah :
  //-   p {{this.c && this.c.count}} + {{this.a && this.b && this.c && this.d && (this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)}} / {{this.items.length}} * 100 = {{this.a && this.b && this.c && this.d && (this.c.count+(this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)/this.items.length*100)}} %
  //-   p     
  //-       strong Hasil Akurasi dari RAK D adalah :
  //-   p {{this.d && this.d.count}} + {{this.a && this.b && this.c && this.d && (this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)}} / {{this.items.length}} * 100 = {{this.a && this.b && this.c && this.d && (this.d.count+(this.a.akurasi+this.b.akurasi+this.c.akurasi+this.d.akurasi)/this.items.length*100)}} %
  
  
  v-card.mt-5
    v-ul(v-for="(value,  index) in (Object.keys(data))" :key="index" )
      v-li
        p 
          strong Hasil Precision dari {{value}} adalah :
        p ({{ data[value].count}} / {{data[value].products}}) * 100 = {{data[value] && data[value].precision}} %

  v-card.mt-5
    v-ul(v-for="(value,  index) in (Object.keys(data))" :key="index" ) 
      v-li
        p 
          strong Hasil Recall dari {{value}} adalah : 
        p {{data[value].count}} / {{ data[value].productSearchCount}} * 100 = {{ data[value].recall}} %
  v-card.mt-5
    v-ul(v-for="(value,  index) in (Object.keys(data))" :key="index" )
      v-li
        p 
          strong Hasil Akurasi dari {{value}} adalah : 
        
        p {{`${data[value].count}`==='0'? 0 :`(${data[value].count} + ${totalAkurasi}) / ${items.length} * 100 = ${(data[value].count+ totalAkurasi)/items.length*100}`}} %


</template>


<script>
import firebase from '../plugins/firebase'
import ManageProductForm from '/components/ManageProductForm';
import Axios from "axios";

export default {
  name: 'DataProduct',
  components: {
    ManageProductForm,
  },
  mounted(){
    // if (!this.$store.getters['getAdminStatus']) {
    //   this.$toast.error('Kamu tidak memiliki akses halaman ini');
    //   this.$router.push('/')
    // }
    this.getData()
  },
  data(){

    return{
      openManageForm: false,
      openDeleteForm: false,
      selectedProduct: {},
      selectedProductToDelete: {},
      openDeletedForm: false,
      items: [],
      searchValue: '',
      headers: [
        {text: 'Kode', value: 'kode'},
        {text: 'Nama Produk', value: 'nama'},
        {text: 'Kategor', value: 'kategori'},
        {text: 'Harga', value: 'harga_toko'},
        {text: 'Rak', value: 'id_rak'},
        {text: 'Stock', value: 'stock'},
      ].map(data => ({...data, sortable: false})),
      a:null,
      b:null,
      c:null,
      d:null,
      e:null,
      data:[],
      totalAkurasi:0,
    }
  },  
  computed: {
    filteredItems: function(){
      return this.items.filter((item) => {
        return item.nama.match(this.searchValue) || item.kode.match(this.searchValue)
      });
    },
  },
  methods: {
    goToManageProduct(item = {}){
      // edit modal
      this.selectedProduct = item;
      this.openManageForm = true;
    },
    async goToAddProduct(){
      // modal tambah produk
      
      
      await Axios.post(
          `http://localhost:5000/api/presicions`,{
            name: this.searchValue,
        }).then((response) => {
            if(response.data){
              const tmp = response.data.data
              let total = 0;
              for (const key in tmp) {
                if (Object.hasOwnProperty.call(tmp, key)) {
                  const element = tmp[key];
                  console.info(element)
                  total +=element.akurasi
                }
              }
              this.totalAkurasi = total;
              this.data= response.data.data;
              console.info(this.data)
            }
        });
       
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
      const response = await Axios.get('http://localhost:5000/product');
      if(response.data){
        this.items = response.data
      }
    },
  },
};
</script>

<style scoped>
  .max{
    max-width: 13rem!important
  }
</style>