
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
                    setTimeout(() => {
                        swal.close()
                    }, 700)
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



//Address
// Add address
$("#addAddress").submit((e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        zip: document.getElementById('zip').value,
        state: document.getElementById('state').value,
        address: document.getElementById('address').value,
        locality: document.getElementById('locality').value,
        city: document.getElementById('city').value
    }
    $.ajax({
        url: '/addAddress',
        method: 'post',
        data: formData,
        success: (response) => {
            console.log(response)
            if (response.status) {
                swal({ text: response.message, icon: "success", button: false })
                setTimeout(() => {
                    location.reload();
                }, 800)
            } else {
                swal({ text: response.message, icon: "error", button: false })
                setTimeout(() => {
                    window.location.replace(response.url)
                }, 800)
            }
        }
    })
})


//editAddress
$(function () {
    $('#editAddress').on('show.bs.modal', function (e) {
        const btn = $(e.relatedTarget);
        const id = btn.data('id');
        console.log(id);
        $('.saveAddress').data('id', id);

        $.ajax({
            url: '/editAddress',
            method: 'post',
            data: {
                addressId: id
            },
            success: (response) => {
                if (response.status) {
                    document.getElementById('ID').value = response.editAddress._id;
                    document.getElementById('editName').value = response.editAddress.name;
                    document.getElementById('editPhoneNumber').value = response.editAddress.phoneNumber;
                    document.getElementById('editZip').value = response.editAddress.zip;
                    document.getElementById('editState').value = response.editAddress.state;
                    document.getElementById('editAddressPlace').value = response.editAddress.address;
                    document.getElementById('editLocality').value = response.editAddress.locality;
                    document.getElementById('editCity').value = response.editAddress.city;
                } else {
                    swal({text: response.message, icon: "error", button: false})
                    setTimeout(() => {
                        window.location.replace(response.url)
                    }, 1000)
                }
            }
        })

        $('.saveAddress').on('click', (e) => {
            e.preventDefault()

            const formData = {
                id: document.getElementById('ID').value,
                name: document.getElementById('editName').value,
                phoneNumber: document.getElementById('editPhoneNumber').value,
                zip: document.getElementById('editZip').value,
                state: document.getElementById('editState').value,
                address: document.getElementById('editAddressPlace').value,
                locality: document.getElementById('editLocality').value,
                city: document.getElementById('editCity').value
            }
            $.ajax({
                url: '/updateAddress',
                method: 'post',
                data: formData,
                success: (response) => {
                    if (response.status) {
                        swal({text: response.message, icon: "success", button: false})
                        setTimeout(() => {
                            location.reload();
                        }, 800)
                    } else {
                        swal({text: response.message, icon: "error", button: false})
                        setTimeout(() => {
                            window.location.replace(response.url)
                        }, 1500)
                    }
                }
            })
        })
    })
})


// Delete Address
function deleteAddress(addressId) {
    $.ajax({
        url: '/deleteAddress',
        method: "post",
        data: {
            addressId: addressId
        },
        success: (response) => {
            console.log(response)
            if(response.status){
                swal({
                    text: "Successfully removed",
                    button: false, 
                })
                setTimeout(()=>{
                    location.reload()
                }, 800)
            }   
        }
    })
}