
//Cart Ajax
function addToCart(productID) {
    $.ajax({
        url: '/addToCart',
        method: 'post',
        data: {
            productID: productID
        },
        success: (response) => {
            if (response.status) {
                swal({
                    text: "Product added to cart.",
                    icon: "success",
                })
                document.getElementById('cartCount').innerHTML = response.cartCount;
            } else {
                swal({
                    text: "Please login first!",
                    icon: "alert",
                    button: false,
                })
                setTimeout(() => {
                    window.location.replace(response.url);
                }, 1000)
            }
        }
    })
}

function removeProduct(Id) {
    $.ajax({
        url: '/removeProduct',
        data: {
            prodObjId: Id,
        },
        method: 'post',
        success: (response) => {
            if (response) {
                swal({
                    text: "Product removed!",
                    icon: "success",
                    button: false
                });
                document.getElementById('cartCount').innerHTML = response.cartCount;
                setTimeout(() => {
                    location.reload()
                }, 1000)
            }
        }
    })
}

function changeQuantity(cartId, count) {
    let quantity = parseInt(document.getElementById(cartId).value)
    $.ajax({
        url: '/changeProductQuantity',
        data: {
            product: cartId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.result.removeProduct) {
                swal({
                    text: "Product removed!",
                    icon: "success",
                    button: false
                });
                setTimeout(() => {
                    location.reload()
                }, 1000)
            } else {
                document.getElementById(cartId).value = quantity + count;
                document.getElementById('price').innerHTML = "₹ " + response.price;
            }
        }
    })
}


//Wishlist
function addToWishlist(productId) {
    $.ajax({
        url: '/addToWishlist',
        data: {
            productId: productId
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                if (response.success) {
                    swal({
                        text: "Product added to wishlist.",
                        icon: "success",
                    })
                    document.getElementById('cartCount').innerHTML = response.cartCount;
                } else {
                    swal({
                        text: response.message,
                        button: false,
                    })
                    setTimeout(()=>{
                        swal.close()
                    },700)
                }
            } else {
                swal({
                    text: "Please login first!",
                    button: false,
                })
                setTimeout(() => {
                    window.location.replace(response.url);
                }, 1000)
            }
        }
    })
}




function removeWishlistProduct(productId) {
    $.ajax({
        url: '/removeWishlistProduct',
        data: {
            productId: productId
        },
        method: 'post',
        success: (response) => {
            if (response) {
                swal({
                    text: "Product removed!",
                    icon: "success",
                    button: false
                });
                setTimeout(() => {
                    location.reload()
                }, 1000)
            }
        }
    })
}