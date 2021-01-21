let app = new Vue({
    el: '#app',
    data: {
        sitename: 'After school classes & activities',
        cart: [],
        lessons: lessons,
        cartShown: false,
        filters: ['name', 'location', 'price', 'availability'],
        orderBy: ['ascending', 'descending'],
        selectedFilter: 'name',
        selectedOrder: 'ascending',
        order: {
            name: {
                value: '',
                error: false,
                errorMessage: ''
            },
            phone: {
                value: '',
                error: false,
                errorMessage: ''
            }
        }
    }, 
    methods: {
        addToCart(lesson) {
            if(this.getAvailability(lesson) > 0) {
                
                let exists = false;
                this.cart.forEach(item => {
                    if(item.lesson == lesson) {
                        exists = true;
                        item.quantity++;
                    }
                });

                if(!exists) {
                    this.cart.push({
                        lesson: lesson,
                        quantity: 1
                    });
                }

            } 
        },
        countInCart(lesson) {
            let count = 0;
            this.cart.forEach(item => {
                if(item.lesson === lesson) {
                    count = item.quantity;
                }
            });
            return count;
        },
        getAvailability(lesson) {
            return lesson.availability - this.countInCart(lesson);
        },
        removeFromCart(index, event) {
            if(event) event.preventDefault();
            this.cart.splice(index, 1);
        },
        isAvailable(lesson) {
            return (this.getAvailability(lesson) <= 0) ? true : false;
        },
        isSelectedFilter(filter) {
            return filter == this.selectedFilter ? true : false;
        },
        isSelectedOrder(order) {
            return order == this.selectedOrder ? true : false;
        },
        decreaseQuantity(item) {
            if(item.quantity > 1) {
                item.quantity--;
            }
        },
        increaseQuantity(item) {
            if(this.getAvailability(item.lesson) >= 1) {
                item.quantity++;
            }
        },
        checkout() {
            alert('The order has been submitted.');
            this.cart = [];
        },
        displayCart(value) {

            this.cartShown = value;
            if(value) {
                document.body.classList.add('body-no-scroll');
            } else {
                document.body.classList.remove('body-no-scroll');
            }

        }
    },
    computed: {
        cartCount() {
            return this.cart.length;
        },
        hasItemInCart() {
            return (this.cartCount <= 0) ? false : true;
        },
        cartTotal() {
           let total = 0;
           this.cart.forEach(item => {
            total += item.lesson.price * item.quantity;
           });
           return total.toFixed(2);
        },
        sortedLessons() {
            let lessonsArray = this.lessons.slice(0); 
            let that = this;
            function compare(a, b) {
                if (a[that.selectedFilter] > b[that.selectedFilter]) {
                    return that.selectedOrder == 'ascending' ? 1 : -1;
                }
                if (a[that.selectedFilter] < b[that.selectedFilter]) {
                    return that.selectedOrder == 'ascending' ? -1 : 1;
                }
                return 0; 
            }
            return lessonsArray.sort(compare); 
        },
        isCartShown() { 
            return this.cartShown; 
        },
        isValidCheckout() {
            return !this.order.name.error && !this.order.phone.error;
        }, 
        isValidName() {
            let item = this.order.name;

            if(item.value.length <= 0) {
                item.error = true;
                item.errorMessage = 'required';
                return item.errorMessage;
            }

            let test = /^[a-zA-Z ]+$/.test(item.value);

            if(test) {
                item.error = false;
                item.errorMessage = '';
                return item.errorMessage;
            } 

            item.error = true;
            item.errorMessage = 'only letters allowed';
            return item.errorMessage;
            
        }, 
        isValidPhone() {

            let item = this.order.phone;

            if(item.value.length <= 0) {
                item.error = true;
                item.errorMessage = 'required';
                return item.errorMessage;
            }

            let test = /^\d+$/.test(item.value);
            
            if(test) {
                item.error = false;
                item.errorMessage = '';
                return item.errorMessage;
            } 

            item.error = true;
            item.errorMessage = 'only numbers allowed';
            return item.errorMessage;

        }
    }
});