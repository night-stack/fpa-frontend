<template lang="pug">
  v-container(fill-height fluid)
    v-row(align='center' justify='center')
      v-col
        v-card.py-5.px-5.text-center
          v-form(ref="form" v-model="valid" lazy-validation)
            h3.display-1 Register
            v-text-field(v-model='formData.name' :rules='requiredRule' label='Nama Lengkap')
            v-text-field(v-model='formData.email'  :rules='requiredRule' label='Email')
            v-text-field(v-model='formData.password' :rules='requiredRule' label='Password' type='password')
            v-text-field(v-model='formData.password_confirm' :rules='requiredRule' label='Konfirmasi Password' type='password')
            v-btn(@click='register', color='secondary') Register
</template>

<script>
import firebase from '../plugins/firebase'
import { DateTimeHelper } from '../helpers'

export default {
  auth: false,
  name: 'registerPage',
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
    }
  },
  methods: {
    async register(){
      this.$refs.form.validate();
      await this.$nextTick();
      if(this.valid){
        console.log(this.formData)
        //proceed register
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.formData.email, this.formData.password)
        .then((authUser) => {
          // Create a user in your Firebase realtime database

          return firebase
            .database()
            .ref(`users/${authUser.user.uid}`)
            .set({
              createdAt: DateTimeHelper.getCurrentTimeMs(),
              name: this.formData.name,
              email: this.formData.email,
            })
        }).then(() => {
          this.$toast.success('Berhasil terdaftar. Silahkan login')
          this.$router.push('/login')
        }).catch((error) => {
          this.$toast.error(error);
        })
      }
    },
  },
}
</script>