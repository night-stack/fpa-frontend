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
              v-text-field(v-model='formData.kode_produk' :rules='requiredRule' :readonly='true' label='Kode Produk')
              v-text-field(v-model='formData.name'  :rules='requiredRule' label='Nama Produk')
              v-text-field(v-model='formData.brand' :rules='requiredRule' label='Brand')
              v-text-field(v-model='formData.price' :rules='requiredRule' label='Harga')
              v-select(v-model='formData.status' :items='statusItem', :rules='requiredRule' item-text='label', label='Status Produk' item-value='value')
              v-text-field(type='number' label='Stock' v-model='formData.stock' :rules='requiredRule' )
              v-select(v-model='formData.shelf' :items='locationItem', item-text='label', label='Lokasi Produk' item-value='value' :rules='requiredRule' )
              v-file-input( 
                @change="showPreviewImage",
                v-model="formData.foto"
                label='Foto Produk'
              )
              v-img(v-if='previewImageURL', height='300' width='300' :src="previewImageURL")
              v-btn.mr-3(@click='clear', color='warning') Batal
              v-btn(@click='save', color='secondary') Simpan

</template>

<script>
import firebase from '../plugins/firebase'
import { DateTimeHelper } from '../helpers'

export default {
  auth: false,
  name: 'ManageProduct',
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
    closeForm: {
      type: Function,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  mounted(){
    if(!Object.keys(this.product).length){
      this.getData()
    }
  },
  data(){
    return{
      statusItem: [
        {
          value: 'available',
          label: "Ada",
        },
        {
          value: 'unavailable',
          label: "Tidak Ada",
        },
      ],
      locationItem: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'].map(rak => ({ label: `Rak ${rak}`, value: rak})),
      valid: false,
      formData: {
        kode_produk: 'KP00001',
      },
      requiredRule: [
          v => !!v || 'Required',
      ],
      previewImageURL: '',
    }
  },
  watch: {
    product(){
      if(this.product){
        this.previewImageURL = this.product.image
        this.formData = { ...this.product };
        return true
      } else {
        return false
      }
    },
  },
  computed: {
    getTitle(){
      return !Object.keys(this.product).length ? 'Tambah Produk' : 'Edit Produk';
    },
  },
  methods: {
    clear(){
      if(!Object.keys(this.product).length){
        this.closeForm(this.formData.kode_produk)
      } else {
        this.closeForm()
      }
    },
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
        const metadata = {
        contentType: 'image/jpeg',
        };
        const type = 'png';
        const newKey = this.formData.id ? this.formData.id : DateTimeHelper.getCurrentTimeMs();
        let urlImg = this.formData.id ? this.formData.image : '';
        if (this.formData.foto) {
          if (this.formData.image) {
            await firebase
              .storage()
              .ref(`products/img-${newKey}.${type}`)
              .delete();
          }
          await firebase
            .storage()
            .ref(`products/img-${newKey}.${type}`)
            .put(this.formData.foto, metadata);
          urlImg = await firebase
            .storage()
            .ref(`products/img-${newKey}.${type}`)
            .getDownloadURL();
        }

        await firebase
        .database()
        .ref(`products/${newKey}`)
        .set({
          image: urlImg,
          id: Number(newKey),
          brand: this.formData.brand,
          kode_produk: this.formData.kode_produk,
          name: this.formData.name,
          price: Number(this.formData.price),
          shelf: this.formData.shelf,
          stock: this.formData.stock,
          status: this.formData.status,
        });
        this.$toast.success('Berhasil tersimpan.')
        this.$emit('input', false);
        this.getData()
      }
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
          this.formData.kode_produk = kodeProduk
        }
      });
    },
  },
}
</script>