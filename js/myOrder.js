
/**
 * 订单js
 * Created by zuohl on 2016/1/14.
 */

/**
 * 获取订单详情
 * @param orderId
 * @returns {string}
 */
function getOrderDetails(orderId) {
    var content = "";
    $.ajax({
        type : "get",
        url  : urls.orderDetails+orderId,
        cache : true,
        async: false,
        dataType: "json",
        beforeSend: function () {
            showLoader("正在加载");
        },
        complete:function(){
            hideLoader();
        },
        success : function(data) {
            if (data.code == "SUCCESS") {
                var order = data.data;
                var lables = new Array();
                
                lables.push("<ul data-role='listview' data-inset='true' class='order_detail_list'>");
                lables.push("<li class='menu_li'>");
                lables.push("<span>实付：");
                lables.push(" ￥"+order.totalMoneyShow);
                lables.push("</span>");
                lables.push("</li>");
                
                
                // 消费明细
                if  (order.userOrderItems != null) {
                    lables.push("<li class='menu_li'>");
                    lables.push("<div>");
                    lables.push("<span>消费明细</span>");
                    lables.push("<ul data-role='listview' data-inset='true' class='menu_list'>");
                    order.userOrderItems.forEach(function(value) {
                        lables.push("<li class='menu_li'>");
                        lables.push("<div class='ui-grid-a'>");
                        lables.push("<div class='ui-block-a align_left'>");
                        lables.push("<span>");
                        lables.push(value.shopProduct.productName);
                        if (isNotEmpty(value.lableDescription)) {
                            lables.push("("+value.lableDescription+")");
                        }
                        lables.push(" x"+value.quantity+value.shopProduct.productUnit);
                        lables.push("</span>");
                        lables.push("</div>");
                        lables.push("<div class='ui-block-b align_center'>");
                        lables.push("<span>");
                        lables.push(value.shopProduct.discountPrice+"元");
                        lables.push("</span>");
                        lables.push("</div>");
                        lables.push("</div>");
                        lables.push("</li>");
                    });
                    lables.push("</ul>");
                    lables.push("</div>");
                    lables.push("</li>");
                }

                // 留言备注
                lables.push("<li class='menu_li'>");
                lables.push("<span>留言备注 : ");
                lables.push(order.orderRemark);
                lables.push("</span>");
                lables.push("</li>");
                
                // 店铺名称
                lables.push("<li class='menu_li'>");
                lables.push("<div>");
                lables.push("<p>");
                lables.push(order.shopName);
                lables.push("</p>");
                lables.push("</div>");
                lables.push("</li>");

                lables.push("<li class='menu_li'>");
                lables.push("<a><img src='image/address.png' class='ui-li-icon' ><span id='shopAddress'>");
                lables.push(order.shop.address);
                lables.push("</span></a>");
                $("#orderDetailsPage").on("tap","#shopAddress",function(){
                    openLocation(order.shop.baiduLatitude,order.shop.baiduLongitude,order.shopName,order.shop.address);
                });

                lables.push("<a href='tel:");
                lables.push(order.shop.phone);
                lables.push("'class='ui-btn-inline' data-icon='phone'></a></li>");

                
                // 消费时间
                lables.push("<li class='menu_li'>");
                lables.push("<span>消费时间 : ");
                lables.push(order.creationTime);
                lables.push("</span>");
                lables.push("</li>");
                
                // 订单编号
                lables.push("<li class='menu_li'>");
                lables.push("<span>订单编号 : ");
                lables.push(order.userOrderId);
                lables.push("</span>");
                lables.push("</li>");
                
                // 桌号人数
                lables.push("<li class='menu_li'>");
                lables.push("<span>桌号人数 : ");
                if (isNotEmpty(order.tableNumber)) {
                    lables.push(order.tableNumber+"桌");
                }
                if (isNotEmpty(order.peopleNumber)) {
                    lables.push(" "+order.peopleNumber+"人");
                }
                lables.push("</span>");
                lables.push("</li>");
                
                // 优惠信息
                if (null != order.userOrderDiscounts && order.userOrderDiscounts.length>0) {
                    lables.push("<li class='menu_li'>");
                    for (var i = 0; i < order.userOrderDiscounts.length; i++) {
                        var discount = order.userOrderDiscounts[i];
                        lables.push("<div class='ui-grid-c'>");
                        lables.push("<div class='ui-block-a align_left'>");
                        if (i == 0) {
                            lables.push("<span>优惠信息：</span>");
                        }
                        lables.push("</div>");
                        lables.push("<div class='ui-block-b align_left'>");
                        if (discount.discountTypeId == 1) {
                            lables.push(discount.discountBean.name);
                        } else {
                            lables.push(discount.discountBean.title);
                        }
                        lables.push("</div>");
                        lables.push("</div>");
                    }
                    lables.push("</li>");
                }
                
                if (order.subOrders != null) {
                    order.subOrders.forEach(function(value) {
                        lables.push("<li class='menu_li'>");
                        lables.push("<a href='orderDetails.html?orderId=");
                        lables.push(value.userOrderId);
                        lables.push("' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>");
                        lables.push("<span>");
                        lables.push(value.creationTime);
                        lables.push("&nbsp;补差额&nbsp;");
                        lables.push(value.totalMoneyShow+"元");
                        lables.push("</span>");
                        lables.push("</a>");
                        lables.push("</li>");
                    });
                }
                if (order.orderStatusId==4 && order.orderTypeId==1) {
                    lables.push("<li class='menu_li'>");
                    lables.push("<input type='button' id='"+order.userOrderId+"' value='申请退款' onclick='orderRefundInit(this)' />");
                    lables.push("</li>");
                }
                lables.push("</ul>");
                content = lables.join("");
            }
            else if (data.code == "BUSINESS_ERROR"){
                $("#errorMsg").html(data.msg);
            }
            else if (data.code == "INVALID_SESSION") {
                returnToLogin(getCurrentUrl());
            }
        }

    });
    return content;
}

/**
 * 获取订单列表
 * @param pageIndex
 * @param orderTab
 * @returns {string}
 */
function getOrderList(pageIndex,orderTab) {
    var content="";
    $.ajax({
        type : "get",
        url  : urls.myOrder,
        cache : true,
        async: false,
        data : {
            t:getToken(),
            pageIndex:pageIndex,
            orderTab:orderTab
        },
        dataType: "json",
        beforeSend: function () {
            showLoader("正在加载");
        },
        complete:function(){
            hideLoader();
        },
        success : function(data) {
            if (data.code == "SUCCESS") {
                pageSize = Math.ceil(data.totalCount/10);
                if (pageIndex == 1 ) {
                    switch (orderTab) {
                        case 0:
                            setValue("consumSize",pageSize);
                            break;
                        case 2:
                            setValue("refundSize",pageSize);
                            break;
                        default:
                            setValue("totalSize",pageSize);
                            break;
                    }
                }
                var temp = data.data;
                if (null == temp) {
                    return "";
                }
                var lables = new Array();
                for (var i = 0; i < temp.length; i++) {
                    var order = temp[i];
                    lables.push("<li id='"+order.shopId+"' class='class_li' >");
                    //<a href=\"#\" onclick=\"goTo('details.html?pic=./img/headpic/5.jpg&name=Warren&time=03-12 13:13&content=测试内容"+i+"&pic=./img/phone.jpg')\">
                    lables.push("<a href='orderDetails.html?orderId=");
                    lables.push(order.userOrderId);
                    lables.push("' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>");
                    lables.push("<p>");
                    lables.push(order.shopName);
                    lables.push("</p>");
                    lables.push("<p>");
                    lables.push(order.totalMoneyShow+"元");
                    var orderStatus = "";
                    switch (order.orderStatusId) {
                        case 9:// 已就餐
                            orderStatus = "已就餐";
                            break;
                        case 7:// 退款成功
                            orderStatus = "退款成功";
                            break;
                        case 6:// 退款中
                            orderStatus = "退款中";
                            break;
                        case 4:// 已支付
                            if (order.orderTypeId == 0) {// 买单订单
                                orderStatus = "交易完成";
                            }
                            if (order.orderTypeId == 1) {// 点菜订单
                                orderStatus = "待消费";
                            }
                            break;
                        default:
                            orderStatus = "";
                            break;
                    }
                    lables.push('<p class="ui-li-aside">');
                    lables.push(orderStatus);
                    lables.push("</p>");
                    lables.push("<p>");
                    lables.push(order.creationTime);
                    if (isNotEmpty(order.peopleNumber)) {
                        lables.push("  "+order.peopleNumber+"人");
                    }
                    if (isNotEmpty(order.tableNumber)) {
                        lables.push("  "+order.tableNumber+"桌");
                    }
                    lables.push("</p>");
                    lables.push("</a>");
                    lables.push("</li>");
                    content = lables.join("");
                }
                //$('#orderList').empty();
            }
            else if (data.code == "BUSINESS_ERROR"){
                $("#errorMsg").html(data.msg);
                //return;
            }
            else if (data.code == "INVALID_SESSION") {
                //setValue("lastUrl",getCurrentUrl());
                returnToLogin("previousPage=myOrder.html");
            }
        }

    });
    return content;
}


function beforechange(e, data) {
    if (typeof data.toPage != "string") {
        var url = $.mobile.path.parseUrl(e.target.baseURI);
        var re = 'orderDetails.html';
        if (url.href.search(re) != -1) {
            var page = $(e.target).find("#orderDetailsPage");
            //var d = data.options.data;
            var params = getUrlParam(url.href);
            var userOrderId = decodeURIComponent(params[0]);
            setValue("orderId",userOrderId);
            page.find(".detailsContent").html(getOrderDetails(userOrderId));
            page.find(".menu_list").listview();
            page.find(".order_detail_list").listview();
        }
    }
}

// 申请退款，初始化页面
function orderRefundInit(obj) {
    var userOrderId = $(obj).attr("id");
    setValue("userOrderId", userOrderId);
    window.location = "orderRefund.html";
}

// 申请退款
function orderRefund() {
    var userOrderId = getValue("userOrderId");
    var refundReason = "";
    $('input:radio[name="refundReason"]:checked').each(function(){
        refundReason = $(this).val();
    });
    $.ajax({
        type : "POST",
        url  : urls.orderRefund,
        cache : false,
        async : false,
        dataType : "json",
        data : {
            t : localStorage.token,
            orderId : userOrderId,
            refundCause : refundReason
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                alert("退款成功，点击确认，返回订单详情页面!");
                window.location = "orderDetails.html?orderId=" + userOrderId;
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            } else if (data.code == "INVALID_SESSION") {
                returnToLogin(getCurrentUrl());
            }
        },
        error : function(data,code) {
            alert("网络问题，请稍后再试...");
        }
    });
}
