<template>
  <div class="container-fluid mt-4 keyword-idea">
    <div>
      <h1 class="h1">Google Keyword Idea</h1>
    </div>
    <div>
      <label for="cateQuerry">keywords(seperate by ','):</label>
      <p><input type="text" style="width:100%;padding: 5px;" v-model="model.q" @change="updateProducts()" /></p>
    </div>
    <div>
      <div class="table table-striped product-all">
        <div :style="`display:${this.loading ? 'block' : 'none'}`">loading ...</div>
        <div :style="`display:${this.noResult && this.keywords.length > 1 ? 'block' : 'none'}`">No result for query: {{
            this.keywords
        }}</div>
        <div v-for="idea in keywordIdeas" :key="idea.text" class="product-item">
          <p class="p-title">
            <a class="product-item-link-short" target="_blank"
              :href="`https://www.google.com/search?tbm=shop&hl=en&psb=1&q=${encodeURIComponent(idea.text)}&sclient=products-cc`"
              :title="`${idea.text}`">
              <span>{{ idea.text }}</span>,&nbsp;&nbsp;&nbsp;
            </a>
            competition:<span :class="`competition-${idea.keywordIdeaMetrics.competition}`">&nbsp;{{
                idea.keywordIdeaMetrics.competition
            }},</span>
            &nbsp;&nbsp;monthlySearches(1 year):<span style="color:blueviolet;font-weight: bolder;">&nbsp;{{
                idea.keywordIdeaMetrics.avgMonthlySearches
            }}</span>
          </p>
          <p>
            <span v-for="monthlyVolume in idea.keywordIdeaMetrics.monthlySearchVolumes" :key="monthlyVolume.month"
              class="monthly-volume-item">
              <span style="color:darkgray;font-size:smaller">{{ monthlyVolume.month.substring(0, 3) }} {{
                  monthlyVolume.year
              }}</span>:<span>&nbsp;{{ monthlyVolume.monthlySearches }};</span>
              &nbsp;&nbsp;&nbsp;
            </span>
          </p>
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
      noResult: false,
      model: { q: null },
      client_basic: { "country_code": "us", "language_code": "en-US", "guest_id": "9053ad00-dabd-4d6a-9943-c7b9ba427c40", "from_site": "m_wholee", "_ga": "GA1.1.654113294.1658837179", "device_id": "139145565.1658837180", "test": "1", "cid": "290463692.1658837179" }
    };
  },
  async created() {
    document.title = "Peng's Google Keyword Idea Tool";
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
      this.loading = false;
      if (idea_list && idea_list.length > 0) {
        idea_list.forEach(it => {
          if (!it.keywordIdeaMetrics) {
            it.keywordIdeaMetrics = { competition: "LOW", avgMonthlySearches: 0, monthlySearchVolumes: [] }
          }
          if (!it.keywordIdeaMetrics.competition) {
            it.keywordIdeaMetrics = { competition: "LOW", avgMonthlySearches: 0 };
            console.log(it)
          }
        });
      }
      idea_list.sort((o1, o2) => {
        return o2.keywordIdeaMetrics.avgMonthlySearches - o1.keywordIdeaMetrics.avgMonthlySearches;
      });
      this.keywordIdeas = idea_list;
      // console.log(idea_list[0]);
      if (!idea_list || idea_list.length <= 0 || !idea_list[0].keywordIdeaMetrics.competition) {
        this.noResult = true;
      } else {
        this.noResult = false;
      }
    }
  }
};
</script>
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

.keyword-idea .product-all {
  margin-top: 10px;
  font-size: 12px;
  display: block;
}

.keyword-idea .product-item {
  box-sizing: border-box;
  padding: 0.5vw;
  width: 100%;
  max-width: 100%;
  margin-right: 1vw;
  border-bottom: 1px solid #998899;
}

.keyword-idea .p-title a {
  color: cornflowerblue;
  font-size: larger;
  font-weight: bolder;
}

.competition-HIGH {
  color: red;
  font-weight: bolder;
}

.competition-LOW {
  color: darkgreen;
  font-weight: bolder;
}

.competition-MEDIUM {
  color: yellowgreen;
  font-weight: bolder;
}
</style>
