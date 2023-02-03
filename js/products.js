import pagination from "./pagination.js";
const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'chikuwa';


const { createApp } = Vue;
let productModal = {};
let delProductModal = {};
const app = createApp({
  //資料
  data(){
    return{
      products:[],
      tempProducts:{
        imagesUrl:[],
      },
      isNew:false,//確認是編輯還是新增
      page:{}
    }
  },
  //方法集
  methods:{
    checkLogin(){
      axios.post(`${url}api/user/check`)
      .then((res) => {
        this.getProducts();
      })
      .catch((err) => {
        alert('請先登入');
        window.location = 'login.html';
      })
    },
    getProducts(page = 1){
      axios.get(`${url}api/${path}/admin/products/?page=${page}`)
      .then((res) => {
        this.products = res.data.products;
        this.page = res.data.pagination;
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },
    openModal(status, item){
      if (status === 'create') {
        productModal.show();
        this.isNew = true;
        //帶入初始化資料
        this.tempProducts = {
          imagesUrl:[],
        };
      } else if (status === 'edit') {
        productModal.show();
        this.isNew = false;
        //帶入當前要編輯資料
        this.tempProducts = {...item};
      } else if (status === 'delete') {
        delProductModal.show();
        // this.isNew = false;
        this.tempProducts = {...item};//等等取id使用
      }
    },
    updateProduct(){
      let updateProductUrl = `${url}api/${path}/admin/product`;
      let method = 'post';
      if (!this.isNew) {
        updateProductUrl = `${url}api/${path}/admin/product/${this.tempProducts.id}`
        method = 'put';
      }
      axios[method](updateProductUrl, {data:this.tempProducts})
      .then((res) => {
        this.getProducts();
        productModal.hide();
      })
      .catch((err) => {
        alert(err.request.response);
      })
    },
    deleteProduct(){
      axios.delete(`${url}api/${path}/admin/product/${this.tempProducts.id}`)
      .then((res) => {
        this.getProducts();
        delProductModal.hide();
      })
      .catch((err) => {
        alert(err.request.response);
      })
    }
  },
  components:{
    pagination,
  },
  //生命週期
  mounted(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)chikuwa\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkLogin();
    productModal = new bootstrap.Modal('#productModal')
    delProductModal = new bootstrap.Modal('#delProductModal')
  }
});

app.component('product-modal', {
  props:['tempProducts','updateProduct'],
  template:'#product-modal-template',
});

app.mount('#app');

