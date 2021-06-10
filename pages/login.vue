<template lang="pug">
  v-container(fill-height fluid)
    v-row(align='center' justify='center')
      v-col
        v-card.py-5.px-5.text-center
          v-form(ref="form" v-model="valid" lazy-validation)
            h3.display-1 Login
            v-text-field(v-model='formData.email' :rules='[ !!formData.email || "Required"]' required label='Email')
            v-text-field(v-model='formData.password' :rules='[ !!formData.password || "Required"]' required label='Password' type='password')
            v-btn(@click='login', color='secondary') Login
</template>

<script>
import firebase from '../plugins/firebase'
import {mapGetters} from 'vuex';

export default {
  name: 'loginPage',
  data(){
    return{
      valid: false,
      formData: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async login(){
      this.$refs.form.validate();
      await this.$nextTick();
      if(this.valid){
        firebase
        .auth()
        .signInWithEmailAndPassword(this.formData.email, this.formData.password)
        .then(async data => {
          const user = JSON.stringify({
            uid: data.uid,
            email: data.email,
            createdAt: data.createdAt,
            emailVerified: data.emailVerified,
          })
          localStorage.setItem('user', user);
          this.$store.dispatch('login', this.formData);
          await this.$nextTick();
          if (this.$store.getters['getUsername']){
            this.$router.push('/');
          }
          else this.$toast.error('gagal login');
        })
        .catch(error => {
          this.error = error
        })
      }
    },
  },
}
</script>