function enableInput(enable) {

    const inputs = $('input').get()

    if (enable) {
        inputs.forEach(element => {
            $(element).prop('readonly', false)
        });
    } else {
        inputs.forEach(element => {
            $(element).prop('readonly', true)
        });
    }

    const selects = $('select').get()
    selects.forEach(element => {
        if (enable) {
            $(element).prop('disabled', false)
        } else {
            $(element).prop('disabled', true)
        }
    });

    const textareas = $('textarea').get()
    textareas.forEach(element => {
        if (enable) {
            $(element).prop('readonly', false)
        } else {
            $(element).prop('readonly', true)
        }
    });


    const checkboxs = $('input[type="checkbox"]').get()
    checkboxs.forEach(element => {
        if (enable) {
            $(element).prop('disabled', false)
        } else {
            $(element).prop('disabled', true)
        }
    });

    const radioes = $('input[type="radio"]').get()
    radioes.forEach(element => {
        if (enable) {
            $(element).prop('disabled', false)
        } else {
            $(element).prop('disabled', true)
        }
    })

    $('#offer_title').prop('readonly', true)

    if(enable) {
        $('#offer-image').attr('data-enable', true)
    } else {
        $('#offer-image').attr('data-enable', false)
    }
}

function formatDateFromNumber(dateNumber) {
    const date = new Date(dateNumber);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so we add 1
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}


function disableShoesList() {
    $('#shoes-div').remove();
    $('#shoes_type').css('display', 'none');
}

function disableShoesTypeList() {
    $('#shoes-type-div').remove()
    $('#shoes').css('display', 'none');
}

function loadShoesList(selectedShoesList) {
    $.ajax({
        type: "get",
        url: "/shoes?state=1&get_id=1&get_name=1&sort_name=1",
        success: function (response) {
            if (response.success) {
                $('#shoes-list').empty()
                console.log(response.data)
                response.data.forEach(shoes => {
                    $('#shoes-list').append(
                        `<div class="form-check">
                            <input ${selectedShoesList.includes(shoes._id) ? 'checked' : ''} class="form-check-input" type="checkbox" value="${shoes._id}" name="shoes-item" id="${shoes._id}" onchange="checkboxListener(this)" disabled/>
                            <label class="form-check-label" for="${shoes._id}">${shoes.name}</label>
                        </div>`
                    )
                })

            } else {
                console.log(response.message)
            }
        },
        error: function (_, err) {
            console.log(err)
        }
    });
}

function loadShoesTypeList(selectedShoesTypeList) {
    $.ajax({
        type: "get",
        url: "/shoes_type?active=true&get_id=1&get_name=1&sort_name=1",
        success: function (response) {
            if (response.success) {
                $('#shoes-type-list').empty()
                response.data.forEach(shoesType => {
                    $('#shoes-type-list').append(
                        `<div class="form-check">
                            <input class="form-check-input" ${selectedShoesTypeList.includes(shoesType._id) ? 'checked' : ''} type="checkbox" value="${shoesType._id}" name="shoes-type-item" id="${shoesType._id}" onchange="checkboxListener(this)" disabled/>
                            <label class="form-check-label" for="${shoesType._id}">${shoesType.name}</label>
                        </div>`
                    )
                })

            } else {
                console.log(response.message)
            }
        },
        error: function (_, error) {
            console.log(error)

        }
    });
}


function loadOfferDetail(_id) {

    let id = _id
    if (id == null) {
        id = $('#offer-id').attr('data-id')
    }

    $.ajax({
        type: "get",
        url: "/offer?_id=" + id,
        success: function (response) {
            if (response.success) {
                const offer = response.data[0]
                console.log(offer)
                $('#offer_title').val(offer.title)
                $('#offer_sub_title').val(offer.sub_title)
                $('#offer_description').val(offer.description)
                $('#offer_discount').val(offer.discount)
                $('#discount_unit').val(offer.discount_unit)
                $('#start-time').val(formatDateFromNumber(offer.start_time))
                $('#end-time').val(formatDateFromNumber(offer.end_time))

                if (offer.applied_user_type[0] == 0) {
                    $('#allCustomer').prop('checked', true)
                    $('#newCustomer').prop('checked', true)
                    $('#silverCustomer').prop('checked', true)
                    $('#goldCustomer').prop('checked', true)
                    $('#diamondCustomer').prop('checked', true)
                } else {

                    $('#newCustomer').val(1)
                    $('#silverCustomer').val(2)
                    $('#goldCustomer').val(3)
                    $('#diamondCustomer').val(4)

                    if (offer.applied_user_type.includes(1)) {
                        $('#newCustomer').prop('checked', true)
                    }

                    if (offer.applied_user_type.includes(2)) {
                        $('#silverCustomer').prop('checked', true)
                    }

                    if (offer.applied_user_type.includes(3)) {
                        $('#goldCustomer').prop('checked', true)
                    }

                    if (offer.applied_user_type.includes(4)) {
                        $('#diamondCustomer').prop('checked', true)
                    }

                }


                if (offer.applied_product_type == '1') {
                    $('#shoes').prop('checked', true)
                    $('#number_of_product').text(`Đã chọn ${offer.applied_shoes.length} giày`)
                    loadShoesList(offer.applied_shoes)
                    disableShoesTypeList()
                } else {
                    $('#shoes_type').prop('checked', true)
                    $('#number_of_product').text(`Đã chọn ${offer.applied_shoes_type.length} loại giày`)
                    loadShoesTypeList(offer.applied_shoes_type)
                    disableShoesList()
                }

                $('#offer-image').attr('src', offer.image)

                if (offer.number_of_offer == '-1') {
                    $('#number_of_offer_unlimited').prop('checked', true)
                    $('#number_of_offer').css('display', 'none')
                } else {
                    $('#number_of_offer').val(offer.number_of_offer)
                }

                $('#number_of_used_offer').text(offer.number_of_used_offer)
                $('#active').val(`${offer.active}`)

                enableInput(false)
            }
        }
    });
}

loadOfferDetail(null)


function enableEditor(element) {
    if($(element).attr('data-enable') == 'true') {
        $('#enable_editor').attr('data-enable', false)
        $('#enable_editor').text('Mở trình chỉnh sửa khuyến mãi')
        $('#save_offer').addClass('d-none')
        enableInput(false)
    } else {
        $('#enable_editor').attr('data-enable', true)
        $('#enable_editor').text('Đóng trình chỉnh sửa khuyến mãi')
        $('#save_offer').removeClass('d-none')
        enableInput(true)
    }        
}

$('#choose-product').click(function (e) {
    e.preventDefault();
    const productInput = $('input[name="product"]:checked').val()
    if (productInput == 'shoes') {
        var bsOffcanvas = new bootstrap.Offcanvas($('#offcanvasForShoes'))
        bsOffcanvas.show()
    } else {
        var bsOffcanvas = new bootstrap.Offcanvas($('#offcanvasForShoesType'))
        bsOffcanvas.show()
    }
});


function checkboxListener(element) {
    if (!$(element).is(':checked')) {
        const div = $(element).parent().parent().parent().find('div')[0]
        const input = $(div).find('input')[0]
        $(input).prop('checked', false)
    }
}

function checkAll(element) {
    const inputs = $(element).parent().next().find('input').get()
    if ($(element).is(':checked')) {
        inputs.forEach(e => {
            $(e).prop('checked', true)
        })
    } else {
        inputs.forEach(e => {
            $(e).prop('checked', false)
        })
    }
}

$('#offer-image').click(function (e) {
    if ($('#offer-image').attr('data-enable') == 'true') {
        $('#image_input').click()
    }
});

$('#image_input').change(function (e) {
    e.preventDefault();
    const formData = new FormData($('#image_form')[0])

    $.ajax({
        url: '/shoes_image/',
        data: formData,
        dataType: 'json',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.success) {
                data.data.forEach(element => {
                    $('#offer-image').attr('src', `${element}`)
                });
            } else {
                alert(data.message)
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    })
});

function removePreviousImage() {
    const imageSrc = $('#offer-image').attr('src')
    if (imageSrc != '/images/add_img_placeholder.png') {
        $.ajax({
            url: '/shoes_image/',
            data: { src: imageSrc },
            type: 'DELETE',
            success: function (data) {
                console.log('delete image successful')
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error);
            }
        })
    }

}

function uploadOffer() {

    const id = $('#offer-id').attr('data-id')
    const subTitle = $('#offer_sub_title').val()
    if (subTitle == '') {
        alert('Vui lòng nhập tiêu đề 2')
        return
    }

    const description = $('#offer_description').val()
    if (description == '') {
        alert('Vui lòng nhập mô tả')
        return
    }

    const discount = $('#offer_discount').val()
    if (discount == '') {
        alert('Vui lòng nhập khuyến mãi')
        return
    }

    const discountUnit = $('#discount_unit').val()
    if (discountUnit == '') {
        alert('Vui lòng nhập đơn vị của khuyến mãi')
        return
    }

    const startTime = $('#start-time').val()
    if (startTime == '') {
        alert('Vui lòng nhập thời gian bắt đầu')
        return
    }

    const endTime = $('#end-time').val()
    if (endTime == '') {
        alert('Vui lòng nhập thời gian kết thúc')
        return
    }

    if ((new Date(endTime).getTime() + (1000 * 60 * 60 * 24 - 1000)) - (new Date(startTime).getTime()) <= 0) {
        alert('Thời gian kết thúc khuyến mãi phải sau thời gian bắt đầu khuyến mãi')
        return
    }

    const userType = []

    if ($('#allCustomer').prop('checked')) {
        userType.push($('#allCustomer').val())
    } else {
        $('input[name="customerType"]:checked').each(function () {
            userType.push($(this).val())
        })
    }

    if (userType.length == 0) {
        alert('Vui lòng chọn loại khách hàng được áp dụng khuyến mãi')
        return
    }

    const applied_shoes = []
    const applied_shoes_type = []
    let appliedProduct = 0

    const productInput = $('input[name="product"]:checked').val()
    if (productInput == 'shoes') {
        appliedProduct = 1
        const shoesList = $('#shoes-list').find('input').get();
        shoesList.forEach(element => {
            if ($(element).is(':checked')) {
                applied_shoes.push($(element).val())
            }
        });

        if (applied_shoes.length == 0) {
            alert('Vui lòng chọn giày được khuyến mãi')
            return
        }

    } else {
        appliedProduct = 2
        const shoesTypeList = $('#shoes-type-list').find('input').get()
        shoesTypeList.forEach(e => {
            if ($(e).is(':checked')) {
                applied_shoes_type.push($(e).val())
            }
        })

        if (applied_shoes_type.length == 0) {
            alert('Vui lòng chọn loại giày được khuyến mãi')
            return
        }
    }


    let imageSrc = $('#offer-image').attr('src')
    if (imageSrc == './images/add_img_placeholder.png') {
        alert('Vui lòng chọn ảnh cho khuyến mãi này')
        return
    }

    let numberOfOffer = -1
    if ($('#number_of_offer_unlimited').prop('checked')) {
        numberOfOffer = -1
    } else {
        const number = $('#number_of_offer').val()
        if (number == '') {
            alert('Vui lòng chọn số lượng vé khuyến mãi')
            return
        } else {
            numberOfOffer = number
        }
    }

    const active = $('#active').val()

    const offer = {
        id: id,
        sub_title: subTitle,
        description: description,
        discount: discount,
        discount_unit: discountUnit,
        start_time: new Date(startTime).getTime(),
        end_time: new Date(endTime).getTime() + (1000 * 60 * 60 * 24 - 1000),
        applied_user_type: userType,
        applied_product_type: appliedProduct,
        image: imageSrc,
        number_of_offer: numberOfOffer,
        active: active
    }

    if (appliedProduct == 1) {
        offer.applied_shoes = applied_shoes
    } else {
        offer.applied_shoes_type = applied_shoes_type
    }

    $.ajax({
        type: "put",
        url: "/offer",
        data: offer,
        success: function (response) {
            if (response.success) {
                $('input').val('')
                alert('Cập nhật thành công một khuyến mãi')
                location.reload()

            } else {
                alert(response.message)
            }
        },
        error: function (_, err) {
            console.log(err)
        }
    });


}









