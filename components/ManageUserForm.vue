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
              template(v-if='getMode')
                v-text-field(v-model='formData.name'  :rules='requiredRule' label='Nama Karyawan')
                v-text-field(v-model='formData.email' :rules='requiredRule' label='Email')
                v-text-field(v-model='formData.password' :rules='requiredRule' label='Password' type='password')
                v-text-field(v-model='formData.password_confirm' :rules='requiredRule' label='Konfirmasi Password' type='password')
                v-file-input( 
                  @change="showPreviewImage",
                  v-model="formData.foto"
                  label='Foto Profil'
                )
                v-img(v-if='previewImageURL', height='300' width='300' :src="previewImageURL")
              template(v-else)
                v-text-field(v-model='formData.name'  :rules='requiredRule' label='Nama Karyawan')
                v-file-input( 
                  @change="showPreviewImage",
                  v-model="formData.foto"
                  label='Foto Profil'
                )
                v-img(v-if='previewImageURL', height='300' width='300' :src="previewImageURL")
              v-btn.mr-3(@click='clear', color='warning') Batal
              v-btn(@click='getMode ? edit : save', color='secondary') Simpan

</template>

<script>
import firebase from '../plugins/firebase'
import { DateTimeHelper } from '../helpers'

export default {
  auth: false,
  name: 'ManageUser',
  props: {
    user: {
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
  data(){
    return{
      valid: false,
      formData: {
        name: '',
        email: '',
        password: '',
      },
      requiredRule: [
          v => !!v || 'Required',
      ],
      previewImageURL: '',
    }
  },
  watch: {
    user(){
      if(this.user){
        this.previewImageURL = this.user.image
        this.formData = { ...this.user };
        return true
      } else {
        return false
      }
    },
  },
  computed: {
    getTitle(){
      return !Object.keys(this.user).length ? 'Tambah' : 'Edit';
    },
    getMode(){
      return !Object.keys(this.user).length ? true : false;
    },
  },
  methods: {
    clear(){
      this.closeForm()
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
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.formData.email, this.formData.password)
          .then(async (authUser) => {
            // Create a user in your Firebase realtime database
            const metadata = {
              contentType: 'image/jpeg',
            };
            const type = 'png';
            const newKey = this.formData.uid ? this.formData.uid : authUser.user.uid;
            let urlImg = this.formData.uid ? this.formData.image : '';
            if (this.formData.foto) {
              if (this.formData.image) {
                await firebase
                  .storage()
                  .ref(`users/img-${newKey}.${type}`)
                  .delete();
              }
              await firebase
                .storage()
                .ref(`users/img-${newKey}.${type}`)
                .put(this.formData.foto, metadata);
              urlImg = await firebase
                .storage()
                .ref(`users/img-${newKey}.${type}`)
                .getDownloadURL();
            }

            return firebase
              .database()
              .ref(`users/${authUser.user.uid}`)
              .set({
                uid: authUser.user.uid,
                createdAt: DateTimeHelper.getCurrentTimeMs(),
                name: this.formData.name,
                email: this.formData.email,
                image: urlImg,
              })
          }).then(() => {
            this.$toast.success('Berhasil terdaftar. Silahkan login')
          }).catch((error) => {
            this.$toast.error(error);
          })

        this.$toast.success('Berhasil tersimpan.')
        this.$emit('input', false);
      }
    },
    async edit(){
      this.$refs.form.validate();
      await this.$nextTick();
      if(this.valid){
        const metadata = {
          contentType: 'image/jpeg',
        };
        const type = 'png';
        const newKey = this.formData.uid ? this.formData.uid : authUser.user.uid;
        let urlImg = this.formData.uid ? this.formData.image : '';
        if (this.formData.foto) {
          if (this.formData.image) {
            await firebase
              .storage()
              .ref(`users/img-${newKey}.${type}`)
              .delete();
          }
          await firebase
            .storage()
            .ref(`users/img-${newKey}.${type}`)
            .put(this.formData.foto, metadata);
          urlImg = await firebase
            .storage()
            .ref(`users/img-${newKey}.${type}`)
            .getDownloadURL();
        }

        await firebase
          .database()
          .ref(`users/${this.formData.uid}/name`)
          .set(this.formData.name)

        await firebase
          .database()
          .ref(`users/${this.formData.uid}/image`)
          .set(urlImg)

        this.$toast.success('Berhasil diubah.')
        this.$emit('input', false);
      }
    },
  },
}
</script>