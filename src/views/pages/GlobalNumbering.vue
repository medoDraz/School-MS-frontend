<template>
  <div  style="padding-top: 45px;">
    <div class="createPost-container">
      <el-form class="form-container">
        <div class="createPost-main-container">
          <el-row>
            <div class="postInfo-container">
              <el-row class="unactiverow">
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Cash in receipt" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input 
							type="radio"
							name="cash_in"
							id="cashin_previous"
							class="cashin_previous"
							v-model="cash_in"
							value="previous"
							required>
                          <label for="cashin_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item 
							label-width="220px" 
							label="number of last issued receipt :"
                            class="postInfo-container-item">
								<el-input v-model="cashin_previous_number" :row="1" style="width: 180px;" name="cashin_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="cash_in" class="cashin_new" id="cashin_new" v-model="cash_in" value="new_serial">
                          <label for="cashin_new" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
                          
						<el-input v-model="cashin_new_number" :row="1" style="width: 180px;" name="cashin_previous_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
			  <el-row class="activerow">
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Cash out receipt" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
						  <input type="radio"
							 name="cash_out"
							 class="cashout_previous"
							 id="cashout_previous"
							 v-model="cash_out"
							 value="previous"
							 required
						   >
                          <label for="cashout_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="number of last issued receipt :"
                                      class="postInfo-container-item">
							 <el-input v-model="cashout_previous_number" :row="1" style="width: 180px;" name="cashout_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="cash_out" class="cashout_new" id="cashout_new" v-model="cash_out" value="new_serial">
                          <label for="cashout_new" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
                          
								 <el-input v-model="cashout_new_number" :row="1" style="width: 180px;" name="cashout_previous_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
			  <el-row class="unactiverow">
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="The payment voucher" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio"
                                 name="payment"
                                 id="payment_previous"
                                 class="payment_previous"
                                 v-model="payment"
                                 value="previous"
                                 required
                          >
                          <label for="payment_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="number of last issued receipt :"
                                      class="postInfo-container-item">
								 <el-input v-model="pay_previous_number" :row="1" style="width: 180px;" name="pay_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="payment" class="payment" id="payment" v-model="payment" value="new_serial">
                          <label for="payment" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
								 <el-input v-model="pay_new_number" :row="1" style="width: 180px;" name="pay_previous_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
			  <el-row class="activerow">
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="The purchase order" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio"
                                 name="purchase"
                                 id="purchase_previous"
                                 class="purchase_previous"
                                 v-model="purchase"
                                 value="previous"
                                 required
                          >
                          <label for="purchase_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="number of last issued receipt :"
                                      class="postInfo-container-item">
                          
								 <el-input v-model="pur_previous_number" :row="1" style="width: 180px;" name="pur_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="purchase" class="purchase_new" id="purchase_new" v-model="purchase" value="new_serial">
                          <label for="purchase_new" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
								 <el-input v-model="pur_new_number" :row="1" style="width: 180px;" name="pur_previous_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
			  <el-row class="unactiverow">
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="The Journal voucher" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio"
                                 name="journal"
                                 id="journal_previous"
                                 class="journal_previous"
                                 v-model="journal"
                                 value="previous"
                                 required
                          >
                          <label for="journal_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="number of last issued receipt :"
                                      class="postInfo-container-item">
								 <el-input v-model="journal_previous_number" :row="1" style="width: 180px;" name="journal_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="journal" class="journal_new" id="journal_new" v-model="journal" value="new_serial">
                          <label for="journal_new" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
								 <el-input v-model="journal_new_number" :row="1" style="width: 180px;" name="journal_new_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
			  <el-row class="activerow" >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Inventory in Inventory out" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio"
                                 name="inventory"
                                 id="inventory_previous"
                                 class="inventory_previous"
                                 v-model="inventory"
                                 value="previous"
                                 required
                          >
                          <label for="inventory_previous" style="font-size: 12px;margin-left: 5px;">Continuo with the
                            serial
                            of the previous academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="number of last issued receipt :"
                                      class="postInfo-container-item">
								 <el-input v-model="inventory_previous_number" :row="1" style="width: 180px;" name="inventory_previous_number" value="123456" readonly type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11" style="">
                        <el-form-item style="margin-left: 0px; margin-bottom: 0px;" label="" class="postInfo-container-item">
                          <input type="radio" name="inventory" class="inventory_new" id="inventory_new" v-model="inventory" value="new_serial">
                          <label for="inventory_new" style="font-size: 12px;margin-left: 5px;">Generate a new serial
                            for this academic year</label>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="">
                        <el-form-item label-width="220px" label="First serial number is :"
                                      class="postInfo-container-item">
								 <el-input v-model="inventory_new_number" :row="1" style="width: 180px;" name="inventory_new_number" type="number" class="article-textarea" autosize />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
            </div>
            </el-col>
          </el-row>
        </div>
		<el-button  style="margin-left: 40%; width: 200px; margin-top: 20px; margin-bottom:20px;" type="success" @click="store">
            Submit
          </el-button>
      </el-form>
    </div>
    </div>
</template>
<script>
    import MDinput from '@/components/MDinput'
	import Sticky from '@/components/Sticky'
	import Warning from './Warning'
    export default {
		name: 'GlobalNubering',
        components: {
            MDinput,
			Sticky,
			Warning
        },
        data() {
            return {
                cash_in: '',
                cashin_previous_number: '123456',
                cashin_new_number: '',
                cash_out: '',
                cashout_previous_number: '123456',
                cashout_new_number: '',
                payment: '',
                pay_previous_number: '123456',
                pay_new_number: '',
                purchase: '',
                pur_previous_number: '123456',
                pur_new_number: '',
                journal: '',
                journal_previous_number: '123456',
                journal_new_number: '',
                inventory: '',
                inventory_previous_number: '123456',
                inventory_new_number: ''
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        computed: {
			cachedViews() {
			  return this.$store.state.tagsView.cachedViews
			},
            isValidForm() {
                return this.cashin_new_number.length > 5 && this.cashout_new_number.length > 5 && this.pay_new_number.length > 5 &&
                    this.pur_new_number.length > 5 && this.journal_new_number.length > 5 && this.inventory_new_number.length > 5
            }
        },
        methods: {
            store() {
        
                let config = {
                    headers: {"content-type": 'multipart/form-data'}
                }
                let formdata = new FormData()
                formdata.append('token', store.getters.token);
                formdata.append('cash_in', this.cash_in)
                formdata.append('cashin_previous_number', this.cashin_previous_number)
                formdata.append('cashin_new_number', this.cashin_new_number)
                formdata.append('cash_out', this.cash_out)
                formdata.append('cashout_previous_number', this.cashout_previous_number)
                formdata.append('cashout_new_number', this.cashout_new_number)
                formdata.append('payment', this.payment)
                formdata.append('pay_previous_number', this.pay_previous_number)
                formdata.append('pay_new_number', this.pay_new_number)
                formdata.append('purchase', this.purchase)
                formdata.append('pur_previous_number', this.pur_previous_number)
                formdata.append('pur_new_number', this.pur_new_number)
                formdata.append('journal', this.journal)
                formdata.append('journal_previous_number', this.journal_previous_number)
                formdata.append('journal_new_number', this.journal_new_number)
                formdata.append('inventory', this.inventory)
                formdata.append('inventory_previous_number', this.inventory_previous_number)
                formdata.append('inventory_new_number', this.inventory_new_number)
                axios.post('/api/setting/global_numbering/store', formdata, config)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(error => {
                        console.log(error)
                        $('.card').append('<div class="alert alert-danger"><p>' + error + '</p></div>')
                    })
            },
        }
    }
	$(document).ready(function(){
        $('.cashin_previous').click(function(){
            $('.cashin_new_number').prop('readonly', true);
            $('.cashin_new_number').prop('required', false);
        });
	});
</script>
<style>
  .el-form-item {
    margin-left: 0px;
  }
  .activerow{
	background: #e2e4e6;
    padding-top: 22px;
    padding-left: 20px;
  }
  .unactiverow{
	background: #ffffff;
    padding-top: 22px;
    padding-left: 20px;
    
    
  }
</style>
