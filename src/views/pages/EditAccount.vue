<template>
  <div style="padding : 35px;">
    <div class="createPost-container">
      <el-form class="form-container">


        <div class="createPost-main-container" style="margin-top: 45px;">
          
          <el-row>
            

            <div class="postInfo-container">
              <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Account code" class="postInfo-container-item">
					<span style="float: left; color:red; font-weight: bold;">*</span>
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                  
					<el-row style="">
						<el-input v-model="code" :rows="1" type="number" class="article-textarea" autosize placeholder="Please enter the Account code" />
					</el-row>
                     
					
                  </el-col>

                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Account lookup" class="postInfo-container-item">
					<span style="float: left; color:red; font-weight: bold;">*</span>
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    
					<el-input v-model="lookup" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          
                  </el-col>


                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Account Description" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-input v-model="description" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />

                  </el-col>

                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Account Type" class="postInfo-container-item">
					<span style="float: left; color:red; font-weight: bold;">*</span>
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    
					<el-select v-model="account_type" placeholder="Choose the type" clearable class="filter-item" style="width: 250px" >
						<el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
					
                  </el-col>


                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Analytics Code" class="postInfo-container-item">
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    
					<el-switch v-model="analytics_code" />
					
                  </el-col>
				  
				  <el-col :span="10">
                    
					<el-select v-if="analytics_code" v-model="analytics_code1" placeholder="Choose the Analytics Code" id="analytics_code1" clearable class="filter-item" style="width: 250px;">
						<el-option v-for="item in analytics_codeOptions" :key="item.id" :label="item.analysis_name+': ' + item.code_id" :value="item.id" />
					</el-select>
					
                  </el-col>


                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Currency" class="postInfo-container-item">
					<span style="float: left; color:red; font-weight: bold;">*</span>
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    
					<el-select v-model="currency" placeholder="Choose the Currency" clearable class="filter-item" style="width: 250px" >
						<el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
					
                  </el-col>


                </el-row>

              </el-row>
			  
			  <el-row >
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Global account " class="postInfo-container-item">
					<span style="float: left; color:red; font-weight: bold;">*</span>
					<span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    
					<el-input v-model="global_account" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          
                  </el-col>


                </el-row>

              </el-row>
			 

            </div>
            </el-col>
          </el-row>
		  
		  


        </div>
		
		<el-button  style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click="store">
            Submit
          </el-button>

      </el-form>

    </div>
	
    </div>
</template>

<script>
    import MDinput from '@/components/MDinput';
	import Sticky from '@/components/Sticky';
	import Warning from './Warning';
	import Multiselect from '@/views/components-demo/drag-select'
	import TabPane from '@/views/tab/components/TabPane'
	import ElDragSelect from '@/components/DragSelect' // base on element-ui
	import store from '@/store'


    export default {
		name: 'EditAccount',
        components: {
            MDinput,
			Sticky,
			Warning,
			Multiselect,
			TabPane,
			ElDragSelect
        },
        data() {
            return {
				activeName: 'Settings',
				theme: false,
				typeOptions: [
				  { key: 'Balance sheet', display_name: 'Balance sheet' },
				  { key: 'P&L', display_name: 'Profit and Loss' },
				  { key: 'Statistics', display_name: 'Statistics' },
				  
				],
				analytics_codeOptions: [
				  
				],
				code: '',
                lookup: '',
                description: '',
                account_type: '',
                analytics_code: '',
                analytics_code1: '',
                currency: '',
                global_account: '',
				
            }
        },
		watch: {
			
		},
        mounted() {
            console.log('Component mounted.');

        },
		 created() {
      this.getAllAnalysticCodes()
			const id = this.$route.params && this.$route.params.id
			this.fetchData(id)
		},
        computed: {
			
            isValidForm() {
                return this.cashin_new_number.length > 5 && this.cashout_new_number.length > 5 && this.pay_new_number.length > 5 &&
                    this.pur_new_number.length > 5 && this.journal_new_number.length > 5 && this.inventory_new_number.length > 5;

            }
        },
        methods: {
			fetchData(id) {
        let config = {
          headers: {"content-type": 'multipart/form-data'}
        };
        let formdata = new FormData();
        formdata.append('token', store.getters.token);
        formdata.append('id', id);
				this.axios.post(store.getters.api_route+'accounting/account/edit', formdata, config)
                    .then(res => {
                        //console.log(res.data.data);
						
						
						this.code=res.data.data.account_code
						this.lookup=res.data.data.account_lookup
						this.description=res.data.data.description
						this.account_type=res.data.data.account_type
						this.analytics_code=res.data.data.analytics_code
						//this.analytics_code1=res.data.data.analytics_code1
						this.currency=res.data.data.currency
						this.global_account=res.data.data.global_account
                    })
                    .catch(error => {
                        console.log(error);
						this.$message({
							message: error,
							type: 'error'
						  })
                        
                    });
			},
      getAllAnalysticCodes() {
        let config = {
          headers: {"content-type": 'multipart/form-data'}
        };
        let formdata = new FormData();
        formdata.append('token', store.getters.token);
        this.axios.post(store.getters.api_route+'accounting/analytics/getallanalystic',formdata,config)
          .then(res => {
            //console.log(res.data.data)
            const { data } = res
            if (!data) {
              console.log('sdfsf')
            }
            this.analytics_codeOptions = res.data.data
          })
          .catch(err => {
            console.log(err)

          });
      },
            store() {
				const id = this.$route.params && this.$route.params.id
                let config = {
                    headers: {"content-type": 'multipart/form-data'}
                };
                let formdata = new FormData();
				formdata.append('id', id);
                formdata.append('account_code', this.code);
                formdata.append('account_lookup', this.lookup);
                formdata.append('description', this.description);
                formdata.append('account_type', this.account_type);
                formdata.append('analytics_code', this.analytics_code);
                formdata.append('analytics_code1', this.analytics_code1);
                formdata.append('currency', this.currency);
                formdata.append('global_account', this.global_account);

                formdata.append('token', store.getters.token);
				
                this.axios.post(store.getters.api_route+'accounting/account/update', formdata, config)
                    .then(res => {
                        //console.log(res);
						if(res.data.error == true){
                          this.$notify({
                            title: res.data.message+' are Required',
                            message: res.data.message+' are Required',
                            type: 'error',
                            duration: 2000
                          })
                        }else{
                          this.$store.dispatch('tagsView/delVisitedView', this.$route)
							this.$router.push({ path: '/accounting/accounts'})
							this.$notify({
								title: 'success',
								message: res.data.message,
								type: 'success',
								duration: 2000
							})
						}
                    })
                    .catch(error => {
                        console.log(error);
						this.$message({
							message: error,
							type: 'error'
						  })
                        
                    });

            },

        }
    }
	

</script>

<style lang="scss" scoped>
	.el-form-item {
    margin-left: 0px;
  }
.drag-select {
  ::v-deep {
    .sortable-ghost {
      opacity: .8;
      color: #fff !important;
      background: #42b983 !important;
    }

    .el-tag {
      cursor: pointer;
    }
  }
}
	.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
  }
  .tab-container {
    margin: 30px;
  }
</style>
