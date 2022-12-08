<template>
  <div class="container-fluid mt-4">
    <div>
      <h1 class="h1">Google Keyword Idea</h1>
    </div>
    <div>
      <label for="cateQuerry">keywords(seperate by ','):</label>
      <p><input type="text" style="width:100%;padding: 5px;" v-model="model.q" @change="updateProducts()" /></p>
    </div>
    <div>
      <div class="table table-striped product-all">
        <div v-for="idea in keywordIdeas" :key="idea.text" class="product-item">
          <a class="product-item-link-short" target="_blank"
            :href="`https://www.google.com/search?tbm=shop&hl=en&psb=1&q=${encodeURIComponent(idea.text)}&sclient=products-cc`" :title="`${idea.text}`">
            <p class="p-title"><span>{{ idea.text.substring(0, 100) + "..." }}</span></p>
          </a>
          competition:{{idea.keywordIdeaMetrics.competition}},
          monthlySearches:{{idea.keywordIdeaMetrics.avgMonthlySearches}}
          <p>
            <span v-for="monthlyVolume in idea.keywordIdeaMetrics.monthlySearchVolumes" :key="monthlyVolume.month" class="monthly-volume-item">
              {{monthlyVolume.month}},{{monthlyVolume.year}}:{{monthlyVolume.monthlySearches}}
            </span>
          </p>
          <!-- <p class="p-price">
            <span>{{ product.productNo }} / </span>
            <span class="mark">{{ product.localPriceSign }}{{ product.primePriceRangeLocal[0] }}</span>
          </p>
          <p class="is-active">
            <span>Is active: </span>
            <span class="mark">{{ product.active ? 'Active' : 'Inactive' }}</span>
          </p>
          <p class="is-active">
            <span>{{ product.categoryNames.join(' > ') }}</span>
          </p>
          <p class="is-active">
            <span>NSFW Score: </span>
            <span class="mark">{{ product.nsfwScore }}</span>
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoogleKeywordIdea",
  data() {
    return {
      keywordIdeas: [],
      keywords: "",
      loading: false,
      model: { q: null },
      client_basic: { "country_code": "us", "language_code": "en-US", "guest_id": "9053ad00-dabd-4d6a-9943-c7b9ba427c40", "from_site": "m_wholee", "_ga": "GA1.1.654113294.1658837179", "device_id": "139145565.1658837180", "test": "1", "cid": "290463692.1658837179" }
    };
  },
  async created() {
    // let localIds = localStorage.getItem("product_id_list");
    // if (localIds) {
    //   this.productIdList = JSON.parse(localIds);
    //   this.fetchAllProducts();
    // } else {
    //   return;
    // }
  },
  methods: {
    async updateProducts() {
      if (!this.model.q) {
        return;
      }
      this.loading = true;
      this.keywords = this.model.q
      // this.productIdList = this.model.q.match(/\d+/g);
      // localStorage.setItem("product_id_list", JSON.stringify(this.productIdList));
      await this.fetchAllKeywordIdeas();
    },
    async fetchAllKeywordIdeas() {
      if (!this.keywords || this.keywords.length <= 0) {
        return;
      }
      this.keywordIdeas = [];
      let encodeKeywords = encodeURIComponent(this.keywords);
      let resp = await fetch(`/marketing-api/keywordIdea/planing?keyword=${encodeKeywords}`, { mode: 'cors' });
      let idea_list = await resp.json();
      this.keywordIdeas = idea_list;
      this.loading = false;

      // this.products.rows = [];
      // const header = { header: { 'client-basic': JSON.stringify(this.client_basic) } };
      // for (let i = 0; i < this.productIdList.length; i++) {
      //   let pid = this.productIdList[i];
      //   let resp = await fetch(`https://www.wholeeshopping.com/gw/cf-detail/api/v2/product/info?productId=${pid}`, header);
      //   let product = await resp.json();
      //   product = product.body
      //   product.categoryNames = product.categoryNames.reverse();
      //   console.log(product.categoryNames);
      //   await this.nsfwDetect(product);
      //   this.products.rows.push(product);
      // }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495e;
}

.product-all {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  font-size: 12px;
  justify-content: flex-start;
}

.product-item {
  box-sizing: border-box;
  padding-bottom: 2vw;
  padding-right: 1vw;
  padding-left: 1vw;
  width: 200px;
  max-width: 50%;
  margin-right: 1vw;
}

.cat-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.mark {
  color: brown;
  font-weight: bolder;
}
</style>
