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
export default {
  auth: false,
  name: 'loginPage',
  data(){
    return{
      valid: false,
      formData: {
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
        //proceed register


        this.$toast.success('Berhasil terdaftar. Silahkan login')
      }
    },
  },
}
</script>