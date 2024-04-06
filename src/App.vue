<template>
  <div class="container">
    <h1>EcoVal</h1>
    <button class="button" @click="evaluateProduct()">{{ buttonText }}</button>
    <div class="response">
      <circle-component :codeRating="sustainabilityRating" v-if="!this.loading" style="scale: 0.5; margin-top: -80px;"/>
      <div class="para">
        <p v-if="!this.loading">{{ this.Reasoning }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* global chrome */
import axios from 'axios';
import CircleComponent from './components/CircleComponent.vue';
export default {
  data() {
      return {
          buttonText: 'Evaluate this product!',
          currentUrl: '',
          sustainabilityRating: 0,
          Reasoning: '',
          loading: true
      };
  },
  components: {
      CircleComponent
  },
  mounted() {
      this.getCurrentTabUrl();
  },
  methods: {
      async evaluateProduct() {
        console.log('Evaluating product');
        this.buttonText = 'Evaluating...';
        //change ip address to your own if testing!
        const response = await axios.post('http://192.168.0.146:3090/evaluate-product', {
            url: this.currentUrl
        });
        console.log(response.data);
        this.sustainabilityRating = response.data.Rating;
        console.log(this.sustainabilityRating);
        this.Reasoning = response.data.Reasoning; 
        console.log(this.Reasoning);
        this.buttonText = 'Evaluate product';
        this.loading = false;
        // this.sustainabilityRating = 80;
        // this.Reasoning = 'This product is highly sustainable. The toothbrushes are made of bamboo, a sustainably sourced material, and they are biodegradable and compostable. All elements of the set are chemical free and are aimed to minimize plastic use, promoting a direct positive impact on the environment. Manufacturing is based in the United Kingdom, contributing to a potentially lesser carbon footprint compared to overseas manufacturing. However, the floss, though not specified, may not be biodegradable and the product packaging, while recyclable, is not necessarily made from post-consumer waste, slightly reducing the score.';
        // this.loading = false;
      },

      getCurrentTabUrl() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
          this.currentUrl = tabs[0].url;
        }
  });
  }
  }
};
</script>

<style scoped>
/* Container adjustments */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  min-height: 600px;
  min-width: 620px;
  background-image: linear-gradient(#f0f4f3, #54B435); /* Light green to dark green */
  color: #355834; /* Earthy text color */
  font-family: 'Arial', sans-serif; /* Consider a more organic font if available */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

/* Button styling */
button {
  background-color: #54B435; /* Deep green */
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 20px; /* Rounded corners for a soft look */
  cursor: pointer;
  transition: background-color 0.3s;
  scale: 1.5;
  margin-top: 40px;
}

button:hover {
  background-color: #54B435; /* Slightly darker green on hover */
}

/* Paragraph (reasoning) styling */
p {
  background-color: #e3ede5; /* Very soft green */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px; /* Adjust based on your preference */
  line-height: 1.6; /* Improved readability */
  padding: 10px;

}
.h1 {
  margin-left: auto;
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 50px;
}
.response {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  margin-left: -100px;
}
.para {
  padding: 10px;
  margin-left: -100px;
  scale: 1.1;
  font-weight: 200;
}

</style>