<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h4>Create Card</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="createCard()">
              <input class="form-control mb-2" type="text" placeholder="Title" v-model="title">
              <span v-if="errorsArr[0].titleError === true" class="text-danger">Enter title between 3 to 30 characters.</span>
              <textarea class="form-control mb-2" type="text" placeholder="description" rows="5" v-model="description"></textarea>
              <div>
                <span v-if="errorsArr[1].descriptionError === true" class="float-left text-danger">Enter description between 3 to 255 characters.</span>
                <span v-if="errorsArr[3].regError === true" class="float-left text-danger">No special character allowed.</span>
                <span class="float-right">{{description.length}}/255</span>
              </div><br>
              <div>
                <span>Select Date: </span>
                <span>
                  <datetime format="DD-MM-YYYY h:i:s" width="300px" placeholder="Select Date" v-model="dateTimeValue"></datetime>
                </span>
                <span v-if="errorsArr[2].dateTimeError === true" class="text-danger">Please select date.</span>
              </div>
              <button class="btn btn-info mt-2">Create Card</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card text-center">
          <div class="card-header">
            <h4>Card List</h4>
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead class="thead-dark1">
                <tr>
                  <th @click="sortByTitle()" class="cursor">Title<i class="fa fa-sort pl-1"></i></th>
                  <th>Description</th>
                  <th @click="sortByDate()" class="cursor">Date-Time<i class="fa fa-sort pl-1"></i></th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody v-if="cardArr.length>0">
                <tr v-for="(card, index) in cardArr" :key="card.title+index">
                  <td class="text-break">{{card.title}}</td>
                  <td class="text-break">{{card.description}}</td>
                  <td>{{card.dateTimeValue | formatDate}} </td>
                  <td><a href="#" @click="showCard(index)">Update</a></td>
                  <td><a href="#" @click="deleteCard(index)">Delete</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- delete Modal -->
    <modal name="delete-card" height="600px">
      <div class="car">
        <div class="card-body">
          <form @submit.prevent="updateCard(currentCardIndex)" v-if="currentCardIndex != null">
              <input class="form-control mb-2" type="text" placeholder="Title" v-model="cardArr[currentCardIndex].title">
              <span v-if="errorsArr[0].titleError === true" class="text-danger">Enter title between 3 to 30 characters.</span>
              <textarea class="form-control mb-2" type="text" placeholder="description" rows="5" v-model="cardArr[currentCardIndex].description"></textarea>
              <div>
                <span v-if="errorsArr[1].descriptionError === true" class="text-left text-danger">Enter description between 3 to 255 characters.</span>
                <span class="text-right"><b>{{description.length}}/255</b></span>
              </div>
              <div>
                <span>Select Date: </span>
                <span>
                  <datetime format="DD-MM-YYYY h:i" width="300px" placeholder="Select Date" v-model="cardArr[currentCardIndex].dateTimeValue"></datetime>
                </span>
                <span v-if="errorsArr[2].dateTimeError === true" class="text-danger">Please select date.</span>
              </div>
              <div class="text-center">
                <button class="btn btn-info mt-4">Update Card</button>
              </div>
            </form>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import datetime from 'vuejs-datetimepicker';

export default {
  name: "CardList",
  data: function() {
    return {
      title: '',
      description: '',
      dateTimeValue: '',
      cardArr: [],
      currentCardIndex: null,
      isSorted: null,
      errorsArr : [
        { titleError: false },
        { descriptionError: false},
        { dateTimeError: false},
        { regError: false }
      ]
    }
  },
  components: {
    datetime
  },
  methods: {

    createCard() {

      // title error handling
      if(this.title.length<3 || this.title.length>30) {
        this.errorsArr[0].titleError = true;
      } else {
        this.errorsArr[0].titleError = false;
      }

      // description error handling
      if(this.description.length<3 || this.description.length>255) {
        this.errorsArr[1].descriptionError = true;
      } else {
        this.errorsArr[1].descriptionError = false;
      }

      // date-time error handling
      if(this.dateTimeValue.length === 0) {
        this.errorsArr[2].dateTimeError = true;
      } else {
        this.errorsArr[2].dateTimeError = false;
      }

      // form submit if form is valid
      if(this.errorsArr[0].titleError == false && this.errorsArr[1].descriptionError === false && this.errorsArr[2].dateTimeError === false) {
        console.log("create card", this.title, this.description, this.dateTimeValue);

        let reg = /^[a-z\d\-_\s]+$/i;

        let res = reg.test(this.description);
        console.log('res', res);
        if(res === false) {
          this.errorsArr[3].regError = true;
        }else {
          this.errorsArr[3].regError = false;

          this.cardArr.unshift({title: this.title, description: this.description, dateTimeValue: this.dateTimeValue})
          this.$store.commit('saveCardArr', this.cardArr)

          this.sortByDate();
        }
        
      }
    },

    showCard (index) {
      console.log('open card', index);
      this.$modal.show('delete-card');
      this.currentCardIndex = index;
    },

    updateCard: function(index) {

      console.log('update card', index, this.cardArr);
      this.$modal.hide('delete-card');
      this.$store.commit('saveCardArr', this.cardArr);
    },

    deleteCard: function(index) {
      console.log('delete card', index);
      this.cardArr.splice(index, 1);
      this.$store.commit('saveCardArr', this.cardArr);
      
    },

    sortByTitle: function() {
      console.log('sor', this.isSorted);

      if(this.isSorted === true) {
        this.cardArr.reverse();
      } else {
        this.cardArr.sort((a, b) => {
          if(a.title < b.title) {
            this.isSorted = true;
            return -1;
          }
          if(a.title > b.title) {
            this.isSorted = true;
            return 1;
          }
        });
        this.$store.commit('saveCardArr', this.cardArr)
      }
    },

    sortByDate: function() {      
      this.cardArr.sort(function(a,b){
        
        var c = new Date(a.dateTimeValue);
        var d = new Date(b.dateTimeValue);
        
        return c > d ? 1 : -1
      });
      
      this.$store.commit('saveCardArr', this.cardArr)
      
    }
  },
  mounted: function() {
    console.log('mounted', this.$store.state.cardArr);
    if(this.$store.state.cardArr.length > 0) {
      this.cardArr = this.$store.state.cardArr;
    }
  }
};
</script>

<style>
.cursor {
  cursor: pointer;
}
</style>