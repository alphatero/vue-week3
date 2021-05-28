let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data() {
        return{
            api: 'https://vue3-course-api.hexschool.io/api',
            path: 'alphatest',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            }
        }
    },
    methods: {
        getData(page = 1) {
            const url = `${this.api}/${this.path}/admin/products?page=${page}`;
            axios.get(url).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    this.products = res.data.products;
                } else {
                    alert(res.data.message);
                }
            })
        },
        updateProduct() {
            let url =`${this.api}/${this.path}/admin/product`;
            let http = 'post';
            if(!this.isNew) {
                url = `${this.api}/${this.path}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }

            axios[http](url, {data:this.tempProduct}).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
        },
        openModal(isNew, item) {
            if(isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if(isNew === 'edit') {
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            } else if(isNew === 'delete') {
                this.tempProduct = {...item};
                delProductModal.show()
            }
        },
        delProduct() {
            const url = `${this.api}/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
        },
        addImgs() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        })
        const token =document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('Please login');
            window.location = 'login.html';
        }
        axios.defaults.headers.common.Authorization = token; //紀錄cookie方法
        this.getData();
    }
}).mount('#app')