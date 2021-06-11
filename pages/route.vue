<template lang=pug>
  v-layout(column)
    h1.display-0.mb-10 Pilih produk yang ingin anda cari
    v-row(row, nowrap)
      v-col(cols='9')
        v-row(row, wrap)
          v-col(v-for='i in 4', cols='6')
            v-card.card-light.mx-auto.mb-3()
              v-list-item-content
                v-row.justify-space-between.px-6.py-6(column, nowrap)
                  v-col.text-center.card-image.flex-grow-0.mx-auto(style='flex-basis: 300px')
                    img.mx-3( :src='`/product-1.jpg`', alt='product', height='200')
                  v-col.item-description-container()
                    h4.display-1.mb-3 Blue Band {{i}} 250 gram
                    p #[b Rp 10.000 ]
                    v-btn(@click='toggle(i-1)' :color='indexExists(i-1) ? primary: secondary ') {{ indexExists(i-1) ? 'Hapus' : 'Cari' }}
      v-col(cols='3')
        p 
          strong Produk dipilih: {{selectedProducts.length}}
        br
        v-btn(@click='findProduct' color='primary') Cari
</template>

<script>
import qs from 'querystring';

export default {
  name: 'Route',
  data(){
    return{
      selectedProducts: [],
    }
  },
  computed: {
  },
  methods: {
    findProduct(){
      if (this.selectedProducts.length < 2){
        const lastShelf = this.selectedProducts[selectedProducts.length - 1]
        this.selectedProducts.push(lastShelf)
        
        // this.$toast.error('Minimal 2 produk');
      }
      else{
        const params = qs.stringify({
          start_city: 'X',
          cities: 'X,C,K,F',
          distance_matrix: {
            X:{X:0,A:51,B:24,C:72,D:92,E:45,F:76,G:96,H:16,I:9,J:121,K:68},
            A:{X:51,A:0,B:66,C:82,D:121,E:69,F:56,G:76,H:6,I:89,J:91,K:124},
            B:{X:24,A:66,B:0,C:45,D:59,E:31,F:49,G:69,H:42,I:47,J:50,K:14},
            C:{X:72,A:82,B:45,C:0,D:21,E:59,F:10,G:20,H:38,I:52,J:45,K:61},
            D:{X:92,A:121,B:59,C:21,D:0,E:27,F:23,G:40,H:22,I:109,J:23,K:8},
            E:{X:45,A:69,B:31,C:59,D:27,E:0,F:33,G:50,H:31,I:22,J:21,K:79},
            F:{X:76,A:56,B:49,C:10,D:23,E:33,F:0,G:6,H:13,I:6,J:119,K:42},
            G:{X:96,A:76,B:69,C:20,D:40,E:50,F:6,G:0,H:20,I:90,J:18,K:77},
            H:{X:16,A:6,B:42,C:38,D:22,E:31,F:13,G:20,H:0,I:62,J:27,K:29},
            I:{X:9,A:89,B:47,C:52,D:109,E:22,F:6,G:90,H:62,I:0,J:30,K:66},
            J:{X:121,A:91,B:50,C:45,D:23,E:21,F:119,G:18,H:27,I:30,J:0,K:11},
            K:{X:68,A:124,B:14,C:61,D:8,E:79,F:42,G:77,H:29,I:66,J:11,K:0},
          },
        })
        this.$store.dispatch('findBestRoute', params);
      }
    },

    indexExists(idx){
      return this.selectedProducts.includes(idx);
    },
    toggle(idx){
      const findIdx = this.selectedProducts.indexOf(idx);
      if (findIdx !== -1) {
        this.selectedProducts.splice(findIdx,1);
      }
      else this.selectedProducts.push(idx);
      console.log(this.selectedProducts);
    },
  },
}
</script>
