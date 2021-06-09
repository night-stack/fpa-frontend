  <template lang="pug">
  v-dialog(
    v-model='value', 
    fullscreen
    transition="dialog-bottom-transition"
  )
    v-container(fill-height fluid)
      v-row(align='center' justify='center')
        v-col
          v-card.py-5.px-5.text-center
            v-form(ref="form" v-model="valid" lazy-validation)
              h3.display-1 {{getTitle}}
              v-text-field(v-model='formData.kode_produk' :rules='requiredRule' label='Kode Produk')
              v-text-field(v-model='formData.nama'  :rules='requiredRule' label='Nama Produk')
              v-text-field(v-model='formData.brand' :rules='requiredRule' label='Brand')
              v-text-field(v-model='formData.harga' :rules='requiredRule' label='Harga')
              v-select(v-model='formData.status' :items='statusItem', :rules='requiredRule' item-text='label', label='Status Produk' item-value='value')
              v-text-field(type='number' label='Stock' v-model='formData.stock' :rules='requiredRule' )
              v-select(v-model='formData.location' :items='locationItem', item-text='label', label='Lokasi Produk' item-value='value' :rules='requiredRule' )
              v-file-input( 
                @change="showPreviewImage",
                v-model="formData.foto"
                label='Foto Produk'
              )
              v-img(v-if='previewImageURL', height='300' width='300' :src="previewImageURL")
              v-btn.mr-3(@click='$emit("input", false)', color='warning') Batal
              v-btn(@click='save', color='secondary') Simpan

</template>

<script>
export default {
  auth: false,
  name: 'ManageProduct',
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data(){
    return{
      statusItem: [
        {
          value: 'Ada',
          label: "Ada",
        },
        {
          value: 'Tidak Ada',
          label: "Tidak Ada",
        },
      ],
      locationItem: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'].map(rak => ({ label: `Rak ${rak}`, value: `Rak ${rak}`})),
      valid: false,
      formData: {},
      requiredRule: [
          v => !!v || 'Required',
      ],
      previewImageURL: '',
    }
  },
  watch: {
    product(){
      this.formData = { ...this.product };
    },
  },
  computed: {
    getTitle(){
      console.log(this.product)
      return !Object.keys(this.product).length ? 'Tambah Produk' : 'Edit Produk';
    },
  },
  methods: {
    showPreviewImage(){
      if (this.formData.foto){
        this.previewImageURL= URL.createObjectURL(this.formData.foto)
      }
      else this.previewImageURL = '';
    },
    async save(){
      this.$refs.form.validate();
      await this.$nextTick();
      if(this.valid){
        console.log(this.formData)
        this.$toast.success('Berhasil tersimpan.')
        this.$emit('input', false);
      }
    },
  },
}
</script>