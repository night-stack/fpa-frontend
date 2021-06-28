<template lang="pug">
  v-layout(column)
    h1.display-0.mb-10 Pilih produk yang ingin anda cari
    v-text-field.mt-5(v-model='searchValue', @change='searchProduct', label='Cari Nama Produk/Kode Produk', prepend-inner-icon='mdi-magnify', filled, dense)
    v-row(row, nowrap)
      v-col(cols='9')
        v-row(row, wrap)
          v-col(v-for='(item, i) in filteredItems', cols='6')
            v-card.card-light.mx-auto.mb-3(min-height='460px', max-height='470px')
              v-list-item-content
                v-row.justify-space-between.px-6.py-6(column, nowrap)
                  v-col.text-center.card-image.flex-grow-0.mx-auto(style='flex-basis: 300px')
                    img.mx-3( :src='item.image', alt='product', height='200')
                  v-col.item-description-container()
                    h4.display-1.mb-3 {{item.name}}
                    p #[b Rp {{Intl.NumberFormat('id').format(item.price)}} ]
                    v-btn(@click='toggle(item.shelf)' :color='indexExists(item.shelf) !== -1 ? "error" : "primary"') {{ indexExists(item.shelf) !== -1 ? 'Hapus' : 'Cari' }}
      v-col(cols='3')
        p 
          strong Produk dipilih: {{selectedProducts.length - 1}}
        br
        v-btn(@click='findProduct' :color='this.process ? "black" : "primary"') {{this.process ? 'Proses' : 'Cari'}}
        //- v-btn(@click='hitung') Hitung
</template>

<script>
import firebase from '../plugins/firebase'
import qs from 'querystring';

export default {
  name: 'Route',
  mounted() {
    this.getData()
  },
  data(){
    return{
      selectedProducts: ['X'],
      products: [],
      searchValue: '',
      data: [],
      start: [],
      process: false,
    }
  },
  computed: {
    filteredItems: function(){
      return this.products.filter((item) => {
        return item.name.match(this.searchValue) || item.kode_produk.match(this.searchValue)
      });
    },
  },
  methods: {
    searchProduct(e){
      this.searchValue = e
    },
    async getData() {
      await firebase.database().ref('products')
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          const list = Object.keys(object).map((key) => ({
            ...object[key],
            cid: key,
          }));
          this.products = list
          
        }
      });

      await firebase.database().ref('shelfs')
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          const list = Object.keys(object).map((key) => ({
            ...object[key],
            cid: key,
          }));
          const filter = list.filter(i => i.shelf !== 'B')
          this.data = filter
          
        }
      });

      await firebase.database().ref('shelfs/B')
      .once('value', (snapshot) => {
        const object = snapshot.val();

        if (object) {
          this.start = object
        }
      });
    },
    async findProduct(){
      // menemukan produk terpilih berdasakan rak terakhir
      this.process = true
      if (this.selectedProducts.length === 2){
        const lastShelf = this.selectedProducts[this.selectedProducts.length - 1]
        this.selectedProducts.push(lastShelf)
        if(lastShelf){
          const start_city = 'X'
          const cities = this.selectedProducts.toString()
          const distance_matrix= `{
            "X":{"X":0,"A":326,"B":451,"C":634,"D":840,"E":190,"F":351,"G":459,"H":560,"I":664,"J":765,"K":814,"L":695,"M":593,"N":526,"O":401,"P":312,"Q":693,"R":1233,"S":1046,"T":1020,"U":237},
            "A":{"X":326,"A":0,"B":227,"C":454,"D":681,"E":322,"F":202,"G":322,"H":519,"I":549,"J":754,"K":890,"L":769,"M":694,"N":649,"O":577,"P":540,"Q":946,"R":1442,"S":1318,"T":1303,"U":217},
            "B":{"X":451,"A":227,"B":0,"C":227,"D":454,"E":338,"F":108,"G":125,"H":336,"I":330,"J":564,"K":736,"L":623,"M":572,"N":547,"O":525,"P":534,"Q":914,"R":1352,"S":1291,"T":1290,"U":226},
            "C":{"X":634,"A":454,"B":227,"C":0,"D":227,"E":477,"F":292,"G":176,"H":245,"I":143,"J":413,"K":628,"L":536,"M":525,"N":530,"O":567,"P":618,"Q":938,"R":1296,"S":1303,"T":1316,"U":397},
            "D":{"X":840,"A":681,"B":454,"C":227,"D":0,"E":666,"F":512,"G":386,"H":332,"I":186,"J":355,"K":591,"L":538,"M":572,"N":605,"O":686,"P":763,"Q":1014,"R":1279,"S":1354,"T":1380,"U":607},
            "E":{"X":190,"A":322,"B":338,"C":477,"D":666,"E":0,"F":230,"G":303,"H":372,"I":485,"J":576,"K":640,"L":518,"M":422,"N":362,"O":262,"P":219,"Q":624,"R":1127,"S":997,"T":985,"U":120},
            "F":{"X":351,"A":202,"B":108,"C":292,"D":512,"E":230,"F":0,"G":129,"H":316,"I":359,"J":552,"K":694,"L":576,"M":510,"N":475,"O":433,"P":432,"Q":821,"R":1279,"S":1198,"T":1193,"U":119},
            "G":{"X":459,"A":322,"B":125,"C":176,"D":386,"E":303,"F":129,"G":0,"H":211,"I":230,"J":442,"K":611,"L":499,"M":453,"N":435,"O":434,"P":465,"Q":820,"R":1236,"S":1195,"T":1199,"U":223},
            "H":{"X":560,"A":519,"B":336,"C":245,"D":332,"E":372,"F":316,"G":211,"H":0,"I":150,"J":235,"K":404,"L":299,"M":280,"N":290,"O":354,"P":432,"Q":702,"R":1055,"S":1062,"T":1078,"U":356},
            "I":{"X":664,"A":549,"B":330,"C":143,"D":186,"E":485,"F":359,"G":230,"H":150,"I":0,"J":271,"K":491,"L":409,"M":416,"N":436,"O":504,"P":577,"Q":849,"R":1169,"S":1203,"T":1222,"U":437},
            "J":{"X":765,"A":754,"B":564,"C":413,"D":355,"E":576,"F":552,"G":442,"H":235,"I":271,"J":0,"K":236,"L":199,"M":271,"N":331,"O":458,"P":563,"Q":700,"R":924,"S":1015,"T":1048,"U":584},
            "K":{"X":814,"A":890,"B":736,"C":628,"D":591,"E":640,"F":694,"G":611,"H":404,"I":491,"J":236,"K":0,"L":122,"M":221,"N":292,"O":430,"P":541,"Q":531,"R":688,"S":803,"T":845,"U":689},
            "L":{"X":695,"A":769,"B":623,"C":536,"D":538,"E":518,"F":576,"G":499,"H":299,"I":409,"J":199,"K":122,"L":0,"M":108,"N":181,"O":322,"P":434,"Q":503,"R":761,"S":819,"T":850,"U":567},
            "M":{"X":593,"A":694,"B":572,"C":525,"D":572,"E":422,"F":510,"G":453,"H":280,"I":416,"J":271,"K":221,"L":108,"M":0,"N":73,"O":214,"P":326,"Q":443,"R":783,"S":787,"T":809,"U":484},
            "N":{"X":526,"A":649,"B":547,"C":530,"D":605,"E":362,"F":475,"G":435,"H":290,"I":436,"J":331,"K":292,"L":181,"M":73,"N":0,"O":141,"P":253,"Q":413,"R":806,"S":773,"T":788,"U":434},
            "O":{"X":401,"A":577,"B":525,"C":567,"D":686,"E":262,"F":433,"G":434,"H":354,"I":504,"J":458,"K":430,"L":322,"M":214,"N":141,"O":0,"P":112,"Q":389,"R":866,"S":766,"T":766,"U":361},
            "P":{"X":312,"A":540,"B":534,"C":618,"D":763,"E":219,"F":432,"G":465,"H":432,"I":577,"J":563,"K":541,"L":434,"M":326,"N":253,"O":112,"P":0,"Q":406,"R":926,"S":778,"T":766,"U":336},
            "Q":{"X":693,"A":946,"B":914,"C":938,"D":1014,"E":624,"F":821,"G":820,"H":702,"I":849,"J":700,"K":531,"L":503,"M":443,"N":413,"O":389,"P":406,"Q":0,"R":558,"S":377,"T":379,"U":737},
            "R":{"X":1233,"A":1442,"B":1352,"C":1296,"D":1279,"E":1127,"F":1279,"G":1236,"H":1055,"I":1169,"J":924,"K":688,"L":761,"M":783,"N":806,"O":866,"P":926,"Q":558,"R":0,"S":395,"T":476,"U":1225},
            "S":{"X":1046,"A":1318,"B":1291,"C":1303,"D":1354,"E":997,"F":1198,"G":1195,"H":1062,"I":1203,"J":1015,"K":803,"L":819,"M":787,"N":773,"O":766,"P":778,"Q":377,"R":395,"S":0,"T":81,"U":1112},
            "T":{"X":1020,"A":1303,"B":1290,"C":1316,"D":1380,"E":985,"F":1193,"G":1199,"H":1078,"I":1222,"J":1048,"K":845,"L":850,"M":809,"N":788,"O":766,"P":766,"Q":379,"R":476,"S":81,"T":0,"U":1102},
            "U":{"X":237,"A":217,"B":226,"C":397,"D":607,"E":120,"F":119,"G":223,"H":356,"I":437,"J":584,"K":689,"L":567,"M":484,"N":434,"O":361,"P":336,"Q":737,"R":1225,"S":1112,"T":1102,"U":0},
          }`
          let payload = new FormData();
          payload.append('cities', cities);
          payload.append('start_city', start_city);
          payload.append('distance_matrix', distance_matrix);

          let params = new URLSearchParams(payload)
          this.$router.push('/map')
          this.$store.dispatch('findBestRoute', params);
          // this.process = false
        }
      }else if(this.selectedProducts.length >= 2){
        const start_city = 'X'
        const cities = this.selectedProducts.toString()
        const distance_matrix= `{
          "X":{"X":0,"A":326,"B":451,"C":634,"D":840,"E":190,"F":351,"G":459,"H":560,"I":664,"J":765,"K":814,"L":695,"M":593,"N":526,"O":401,"P":312,"Q":693,"R":1233,"S":1046,"T":1020,"U":237},
          "A":{"X":326,"A":0,"B":227,"C":454,"D":681,"E":322,"F":202,"G":322,"H":519,"I":549,"J":754,"K":890,"L":769,"M":694,"N":649,"O":577,"P":540,"Q":946,"R":1442,"S":1318,"T":1303,"U":217},
          "B":{"X":451,"A":227,"B":0,"C":227,"D":454,"E":338,"F":108,"G":125,"H":336,"I":330,"J":564,"K":736,"L":623,"M":572,"N":547,"O":525,"P":534,"Q":914,"R":1352,"S":1291,"T":1290,"U":226},
          "C":{"X":634,"A":454,"B":227,"C":0,"D":227,"E":477,"F":292,"G":176,"H":245,"I":143,"J":413,"K":628,"L":536,"M":525,"N":530,"O":567,"P":618,"Q":938,"R":1296,"S":1303,"T":1316,"U":397},
          "D":{"X":840,"A":681,"B":454,"C":227,"D":0,"E":666,"F":512,"G":386,"H":332,"I":186,"J":355,"K":591,"L":538,"M":572,"N":605,"O":686,"P":763,"Q":1014,"R":1279,"S":1354,"T":1380,"U":607},
          "E":{"X":190,"A":322,"B":338,"C":477,"D":666,"E":0,"F":230,"G":303,"H":372,"I":485,"J":576,"K":640,"L":518,"M":422,"N":362,"O":262,"P":219,"Q":624,"R":1127,"S":997,"T":985,"U":120},
          "F":{"X":351,"A":202,"B":108,"C":292,"D":512,"E":230,"F":0,"G":129,"H":316,"I":359,"J":552,"K":694,"L":576,"M":510,"N":475,"O":433,"P":432,"Q":821,"R":1279,"S":1198,"T":1193,"U":119},
          "G":{"X":459,"A":322,"B":125,"C":176,"D":386,"E":303,"F":129,"G":0,"H":211,"I":230,"J":442,"K":611,"L":499,"M":453,"N":435,"O":434,"P":465,"Q":820,"R":1236,"S":1195,"T":1199,"U":223},
          "H":{"X":560,"A":519,"B":336,"C":245,"D":332,"E":372,"F":316,"G":211,"H":0,"I":150,"J":235,"K":404,"L":299,"M":280,"N":290,"O":354,"P":432,"Q":702,"R":1055,"S":1062,"T":1078,"U":356},
          "I":{"X":664,"A":549,"B":330,"C":143,"D":186,"E":485,"F":359,"G":230,"H":150,"I":0,"J":271,"K":491,"L":409,"M":416,"N":436,"O":504,"P":577,"Q":849,"R":1169,"S":1203,"T":1222,"U":437},
          "J":{"X":765,"A":754,"B":564,"C":413,"D":355,"E":576,"F":552,"G":442,"H":235,"I":271,"J":0,"K":236,"L":199,"M":271,"N":331,"O":458,"P":563,"Q":700,"R":924,"S":1015,"T":1048,"U":584},
          "K":{"X":814,"A":890,"B":736,"C":628,"D":591,"E":640,"F":694,"G":611,"H":404,"I":491,"J":236,"K":0,"L":122,"M":221,"N":292,"O":430,"P":541,"Q":531,"R":688,"S":803,"T":845,"U":689},
          "L":{"X":695,"A":769,"B":623,"C":536,"D":538,"E":518,"F":576,"G":499,"H":299,"I":409,"J":199,"K":122,"L":0,"M":108,"N":181,"O":322,"P":434,"Q":503,"R":761,"S":819,"T":850,"U":567},
          "M":{"X":593,"A":694,"B":572,"C":525,"D":572,"E":422,"F":510,"G":453,"H":280,"I":416,"J":271,"K":221,"L":108,"M":0,"N":73,"O":214,"P":326,"Q":443,"R":783,"S":787,"T":809,"U":484},
          "N":{"X":526,"A":649,"B":547,"C":530,"D":605,"E":362,"F":475,"G":435,"H":290,"I":436,"J":331,"K":292,"L":181,"M":73,"N":0,"O":141,"P":253,"Q":413,"R":806,"S":773,"T":788,"U":434},
          "O":{"X":401,"A":577,"B":525,"C":567,"D":686,"E":262,"F":433,"G":434,"H":354,"I":504,"J":458,"K":430,"L":322,"M":214,"N":141,"O":0,"P":112,"Q":389,"R":866,"S":766,"T":766,"U":361},
          "P":{"X":312,"A":540,"B":534,"C":618,"D":763,"E":219,"F":432,"G":465,"H":432,"I":577,"J":563,"K":541,"L":434,"M":326,"N":253,"O":112,"P":0,"Q":406,"R":926,"S":778,"T":766,"U":336},
          "Q":{"X":693,"A":946,"B":914,"C":938,"D":1014,"E":624,"F":821,"G":820,"H":702,"I":849,"J":700,"K":531,"L":503,"M":443,"N":413,"O":389,"P":406,"Q":0,"R":558,"S":377,"T":379,"U":737},
          "R":{"X":1233,"A":1442,"B":1352,"C":1296,"D":1279,"E":1127,"F":1279,"G":1236,"H":1055,"I":1169,"J":924,"K":688,"L":761,"M":783,"N":806,"O":866,"P":926,"Q":558,"R":0,"S":395,"T":476,"U":1225},
          "S":{"X":1046,"A":1318,"B":1291,"C":1303,"D":1354,"E":997,"F":1198,"G":1195,"H":1062,"I":1203,"J":1015,"K":803,"L":819,"M":787,"N":773,"O":766,"P":778,"Q":377,"R":395,"S":0,"T":81,"U":1112},
          "T":{"X":1020,"A":1303,"B":1290,"C":1316,"D":1380,"E":985,"F":1193,"G":1199,"H":1078,"I":1222,"J":1048,"K":845,"L":850,"M":809,"N":788,"O":766,"P":766,"Q":379,"R":476,"S":81,"T":0,"U":1102},
          "U":{"X":237,"A":217,"B":226,"C":397,"D":607,"E":120,"F":119,"G":223,"H":356,"I":437,"J":584,"K":689,"L":567,"M":484,"N":434,"O":361,"P":336,"Q":737,"R":1225,"S":1112,"T":1102,"U":0},
        }`
      
        let payload = new FormData();
        payload.append('cities', cities);
        payload.append('start_city', start_city);
        payload.append('distance_matrix', distance_matrix);

        let params = new URLSearchParams(payload)
        this.$store.dispatch('findBestRoute', params);
        // this.process = false
        // this.$router.push('/map')
      }else{
        this.$toast.error('Minimal pilih 1 produk');
      }
    },
    indexExists(shelf){
      // cek index
      return this.selectedProducts.indexOf(shelf)
    },
    toggle(shelf){
      // console.log(idx)
      const findIdx = this.selectedProducts.indexOf(shelf);
      if (findIdx !== -1) {
        this.selectedProducts.splice(findIdx,1);
      }
      else this.selectedProducts.push(shelf);
      // console.log(this.selectedProducts);
    },
    hitung(){
      // hitung jarak antar titik manual
      const array = []

      this.data.forEach(i => {
        // const rumus = Match.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        // const x = x2 - x1
        // const y = y2 - y1
        const x = this.start.x - i.x
        const y = this.start.y - i.y
        const hasil = Math.round(Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2))))
        array.push({
          rak: i.shelf,
          hasil,
        })
      });
      // console.log(array)      
    },
  },
}
</script>
