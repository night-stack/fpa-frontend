<template lang="pug">
v-layout(column)
  v-btn(@click='goToAddUser').align-self-start 
    v-icon mdi-plus
    | Tambah Karyawan
  v-text-field.mt-5(v-model='searchValue', @change='searchUser', label='Cari Nama Karyawan', prepend-inner-icon='mdi-magnify', filled, dense)
  v-data-table(:headers='headers', :items='filteredItems', hide-default-footer)
    v-progress-linear(slot='progress', color='primary', indeterminate)
    template(v-slot:item.name="{item}")
      td
        p.max {{item.name}}
    template(v-slot:item.image="{item}")
      td
        img.mx-3(:src='item.image', alt='users', height='100')
    template(v-slot:item.email="{item}")
      td
        p.max {{item.email}}
    template(v-slot:item.edit='{item}')
      td
        v-btn(@click='goToManageUser(item)')
          v-icon mdi-pencil
        //- v-btn( @click='goToDeleteForm(item)').mx-3
        //-   v-icon(color='error') mdi-delete
  manage-user-form(v-model='openManageForm', :user='selectedUser' :closeForm='closeForm')
  v-dialog(v-model='openDeleteForm', width='400')
    v-card.text-center.py-3.px-3
      p Apakah anda ingin menghapus {{openDeleteFormToDelete.name }} ? {{openDeleteFormToDelete.uid}}
      v-btn.mr-3(color='primary' @click='proceedToDelete') Ya
      v-btn(color='secondary' @click='openDeleteForm = false') Tidak
  v-dialog(v-model='openDeletedForm', width='400')
    v-card.text-center.py-3.px-3
      p User {{openDeleteFormToDelete.name }} {{openDeleteFormToDelete.uid}} Berhasil dihapus.
      v-btn(color='secondary' @click='openDeletedForm = false') Oke
</template>


<script>
import firebase from '../../plugins/firebase'
import ManageUserForm from '/components/ManageUserForm';

export default {
  name: 'AdminDataUsers',
  components: {
    ManageUserForm,
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
      selectedUser: {},
      selectedUserToDelete: {},
      openDeleteFormToDelete: {},
      openDeletedForm: false,
      items: [],
      searchValue: '',
      headers: [
        {text: 'Profil', value: 'image'},
        {text: 'Nama', value: 'name'},
        {text: 'Email', value: 'email'},
        {text: 'Edit', value: 'edit'},
      ].map(data => ({...data, sortable: false})),
    }
  },
  computed: {
    filteredItems: function(){
      return this.items.filter((item) => {
        return item.name.match(this.searchValue)
      });
    },
  },
  methods: {
    goToManageUser(item = {}){
      this.selectedUser = item;
      this.openManageForm = true;
    },
    goToAddUser(){
      this.openManageForm = true;
    },
    goToDeleteForm(item){
      this.selectedUserToDelete = item;
      this.openDeleteForm = true;
    },
    closeForm(){
      this.selectedUser = {};
      this.openManageForm = false;
    },
    async proceedToDelete(){
      this.items = this.items.filter(item => item.uid !== this.openDeleteFormToDelete.uid);
      await firebase.database().ref(`users/${this.selectedProductToDelete.uid}`).remove();
      this.selectedProductToDelete = {};
      this.openDeleteForm = false;
      this.openDeletedForm = true;
    },
    searchUser(e){
      this.searchValue = e
    },
    async getData(){
      await firebase.database().ref('users')
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