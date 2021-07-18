<template lang='pug'>
  v-app(dark)
    v-app-bar(:clipped-left='clipped' fixed app)
      nuxt-link(to='/', v-if='username')
        v-toolbar-title(v-text='title')
      v-toolbar-title(v-text='title', v-else)
      v-spacer

      template(v-if='!isAdmin && username')
        nuxt-link.app-bar-link(v-for='link in links' :key='link.to' :to='link.to' :class='link.to === $route.path ? "active" : ""')
          div {{link.title}}
        div.app-bar-link(v-if='username', @click="logout") LOGOUT
      template(v-if='!username')
        nuxt-link.app-bar-link(v-for='link in guestLinks' :key='link.to' :to='link.to' :class='link.to === $route.path ? "active" : ""')
          div {{link.title}}
      template(v-if='isAdmin')
        nuxt-link.app-bar-link(v-for='link in adminLinks' :key='link.to' :to='link.to' :class='$route.path.indexOf(link.to) !== -1 ? "active" : ""')
          div {{link.title}}
        div.app-bar-link(@click="logout") LOGOUT
      p.ml-5(v-if='username') {{username}}
    v-main
      v-container
        nuxt
    v-navigation-drawer(v-model='rightDrawer' :right='right' temporary fixed)
      v-list
        v-list-item(@click.native='right = !right')
          v-list-item-action
            v-icon(light)  mdi-repeat 
          v-list-item-title Switch drawer (click me)
    v-footer(:absolute='!fixed' app)
      span &copy; {{ new Date().getFullYear() }}

</template>

<script>
import firebase from '../plugins/firebase'
import {mapGetters} from 'vuex';

export default {
  name: 'IndexPage',
  computed: {
    ...mapGetters({
      isAdmin: 'getAdminStatus',
      username: 'getUsername',
    }),
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      links: [
        {
          to: '/',
          title: 'HOME',
        },
        {
          to: '/products',
          title: 'PRODUK',
        },
        {
          to: '/about',
          title: 'ABOUT US',
        },
        {
          to: '/route',
          title: 'ROUTE',
        },
        {
          to: '/algo',
          title: 'ALGO',
        },
      ],
      guestLinks: [
        {
          to: '/',
          title: 'HOME',
        },
        {
          to: '/products',
          title: 'PRODUK',
        },
        {
          to: '/about',
          title: 'ABOUT US',
        },
        {
          to: '/route',
          title: 'ROUTE',
        },
        // {
        //   to: '/algo',
        //   title: 'ALGO',
        // },
        {
          to: '/login',
          title: 'Login',
        },
      ],
      adminLinks: [
        {
          to: '/data-products',
          title: 'DATA PRODUK',
        },
        {
          to: '/data-karyawan',
          title: 'DATA KARYAWAN',
        },
        {
          to: '/algo',
          title: 'ALGO',
        },
        {
          to:'/register',
          title:'REGISTER',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MAOU',
    }
  },
  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          console.log('signed in')
          // firebase
          //   .auth()
          //   .currentUser.getIdToken(true)
          //   .then(token => Cookies.set('access_token', token))
          this.loggedIn = true
        } else {
          // Cookies.remove('access_token')
          // if (Cookies.set('access_token', 'blah')) {
          // }
          // No user is signed in.
          this.loggedIn = false
          console.log('signed out', this.loggedIn)
        }
      })
    },
    async logout() {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user');
          this.$store.dispatch('logout');
          this.$router.push('/login')
        })
    },
  },
}
</script>

<style scoped>
a{
  text-decoration:  none !important;
  color: inherit;  
}
.app-bar-link{
  margin-right: 10px;

}
div.app-bar-link{
  cursor: pointer;
}
.app-bar-link.active{
  color: orange;
}
</style>