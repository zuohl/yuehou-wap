var totalPrice = 0;

// 店铺列表页面点击加载更多时调用
function loadMore() {
    var pageIndex = getValue("mainPageIndex");
    var totalCount = $("#totalCount").val();
    var pageItem = 10;
    var pageSize = Math.ceil(totalCount/pageItem);
    if (pageIndex >= pageSize) {
        $('#moreP').html("没有更多了");
        return;
    }
    setValue("mainPageIndex", parseInt(pageIndex)+1);
    loadMainPage(pageIndex);
}

function loadMainPage(mainPageIndex,keyWords) {
    //var keyWords = $("#searchKeyWords").val();
    var lables = new Array();
    $.ajax({
        type : "POST",
        url  : urls.shopList,
        cache : true,
        async: false,
        dataType:"json",
        data : {
            city : "深圳",
            keyWords:keyWords,
            pageIndex : mainPageIndex,
            currentLatitude : getValue("latitude"),
            currentLongitude : getValue("longitude")
        },      
        success : function(data) {
            if (data.code == "SUCCESS") {
                var temp = data.data;
                for (var i = 0; null != temp && i < temp.length; i++) {
                    lables.push("<li data-icon='false' id='"+temp[i].shopId+"' name='"+temp[i].name+"' onclick='selectShop(this)'>");
                    lables.push("<a href='#'>");
                    lables.push("<img src='"+temp[i].logo+"' alt='"+temp[i].name+"' style='padding:8px 0px' />");

                    lables.push("<h3>");
                    lables.push(temp[i].name);
                    lables.push("</h3>");
                    lables.push("<p>");
                    lables.push(temp[i].address);
                    lables.push("</p>");
                    lables.push("<p >");
                    lables.push("人均："+temp[i].avgpriceShow+"元");
                    lables.push("<span class='shopDistance'>");
                    lables.push(temp[i].distanceShow);
                    lables.push("</span>")
                    lables.push("</p>");

                    lables.push("</a>");
                    lables.push("</li>");
                }
/*                $('#listUl').append(lables.join(""));
                $('#listUl').listview('refresh');*/
                var pageSize = Math.ceil(data.totalCount/10);
                setValue("mainPageSize",pageSize);
                //$('#moreP').html("加载更多("+mainPageIndex+"/"+pageSize+")");
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            }
        },
        error : function(data,code) {
            alert("网络连接好像出问题了");
        }
    });
    return lables.join("");
}

function selectShop(obj) {
    localStorage.shopId = $(obj).attr("id");
    localStorage.shopName = $(obj).attr("name");
    window.location = "menu.html";
}

var tempData = "";
// 点菜页面
function loadOrderMenuPage(shopId) {
    $('#totalPrice').html(totalPrice);
    $.ajax({
        type : "POST",
        url  : urls.orderMenu,
        cache : false,
        dataType:"json",
        data : {
            shopId : shopId
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                var temp = data.data;
                tempData = data.data;
                var leftArray = new Array();
                var contentArray = new Array();
                // 是否有菜品信息
                var hasMenuFlag = false;
                $.each(temp, function(i,productTag){
                    if (null != productTag.shopProducts) {
                        hasMenuFlag = true;
                        leftArray.push("<li data-icon='false'><a onclick='clickLeftMenu(this)' href='#");
                        //leftArray.push(productTag.shopProductTagId);
                        leftArray.push("' data-ajax='false' name='"+productTag.shopProductTagId+"' class='left_menu'>");
                        leftArray.push(productTag.name);
                        leftArray.push("<sup id='"+productTag.shopProductTagId+"_sup'></sup>");
                        leftArray.push("</a></li>");
                        contentArray.push("<li data-role='list-divider' id='");
                        contentArray.push(productTag.shopProductTagId);
                        contentArray.push("'>");
                        contentArray.push(productTag.name);
                        contentArray.push("</li>");
                        $.each(productTag.shopProducts, function(j,shopProduct) {
                            contentArray.push("<li id='"+shopProduct.shopProductId+"' class='class_li'>");
                            contentArray.push("<img src='"+shopProduct.productImage+"' alt='"+shopProduct.productName+"' style='padding:20px 0px' />");
                            contentArray.push("<p>");
                            contentArray.push(shopProduct.productName);
                            if (shopProduct.season == 1) {
                                contentArray.push("(时令菜)");
                            }
                            contentArray.push("</p>");
                            contentArray.push("<p>");
                            contentArray.push("<span id='"+shopProduct.shopProductId+"_span' class='unit_price'>");
                            contentArray.push(shopProduct.discountPrice);
                            contentArray.push("</span>");
                            contentArray.push("<span>");
                            contentArray.push("元/"+shopProduct.productUnit);
                            contentArray.push("</span>");
                            contentArray.push("</p>");
                            contentArray.push("<p>");
                            contentArray.push("<span>");
                            var salesCount = contentArray.salesStatistics;
                            if (null == salesCount) {
                                salesCount = 0;
                            }
                            contentArray.push("月售："+salesCount);
                            contentArray.push("</span>");
                            contentArray.push("</p>");
                            contentArray.push("<p>");
                            contentArray.push("<span class='i_box'>");
                            contentArray.push("<a href='javascript:;' tagId='"+productTag.shopProductTagId+"' class='J_minus' onclick='minus(this)'>-</a>");
                            contentArray.push("&nbsp;<span class='count_class' id='"+shopProduct.shopProductId+"' name='"+shopProduct.productName+"' tagType='"+productTag.shopProductTagType+"' price='"+shopProduct.discountPrice+"'>0</span>&nbsp;");
                            contentArray.push("<a href='javascript:;' tagId='"+productTag.shopProductTagId+"' class='J_add' onclick='plus(this)'>+</a>");
                            contentArray.push("</span>");
                            contentArray.push("</p>");
                            contentArray.push("</li>");
                        });
                    }
                });
                if (!hasMenuFlag) {
                    $('#content_div').html("<br/><p align='center'>温馨提示：当前店铺正在维护，请先选择其它店铺！</p>");
                    return;
                }
                $('#tablist-left').html(leftArray.join("")).listview('refresh');
                $('#tablist-content').html(contentArray.join("")).listview('refresh');
/*                for (var i = 0; i < temp.length; i++) {
                    if (null != temp[i].shopProducts) {
                        lables.push("<div data-role='collapsible'>");
                        if (i == 0) {
                            lables.push("<h3 id='firstH3'>");
                        } else {
                            lables.push("<h3>");
                        }
                        lables.push(temp[i].name);
                        lables.push("</h3>");
                        lables.push("<div>");
                        lables.push("<ul data-role='listview' data-inset='true' class='menu_ul'>");
                        for (var j = 0; j < temp[i].shopProducts.length; j++) {
                            var product = temp[i].shopProducts[j];
                            lables.push("<li id='"+product.shopProductId+"' class='class_li'>");
                            lables.push("<img src='"+product.productImage+"' alt='"+product.productName+"' />");
                            lables.push("<span id='"+product.shopProductId+"_span'>");
                            lables.push(product.discountPrice);
                            lables.push("</span>");
                            lables.push("<span>");
                            lables.push("元/"+product.productUnit);
                            lables.push("</span>");
                            lables.push("<span>");
                            lables.push(product.productName);
                            lables.push("</span>");
                            lables.push("<span>");
                            var salesCount = product.salesStatistics;
                            if (null == salesCount) {
                                salesCount = 0;
                            }
                            lables.push("月售："+salesCount);
                            lables.push("</span>");
                            lables.push("<div>");
                            lables.push("<div class='i_box'>");
                            lables.push("<a href='javascript:;' class='J_minus' onclick='minus(this)'>-</a>");
                            lables.push("&nbsp;<span class='count_class' id='"+product.shopProductId+"' name='"+product.productName+"' tagType='"+temp[i].shopProductTagType+"' price='"+product.discountPrice+"'>0</span>&nbsp;");
                            lables.push("<a href='javascript:;' class='J_add' onclick='plus(this)'>+</a>");
                            lables.push("</div>");
                            lables.push("</div>");
                            lables.push("</li>");
                        }
                        lables.push("</ul>");
                        lables.push("</div>");
                        lables.push("</div>");
                    }
                }
              $('#collapsible_div').append(lables.join(""));
                
                $('#collapsible_div').trigger('create');
                $('.menu_ul').listview('refresh');
                $('#firstH3').click();
                $('#totalCount').val(data.totalCount);*/
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}

// 减少数量
function minus(obj) {
    var value = $(obj).next().html();
    if (value == 0) {
        return;
    }
    $(obj).next().html(parseInt(value)-1);
    // 需要删除和已经删除的数量，当已经删除的数量等于需要删除的数量时，退出循环
    var needDelCount = 0;
    var hasDelCount = 0;
    for (var i = tmpLables.length-1; i >= 0; i--) {
        var tmpObj = tmpLables[i];
        if ($(obj).next().attr("id") == tmpObj.shopProductId) {
            needDelCount = tmpObj.count;
            // 从数组中移除当前元素
            tmpLables.splice(i,1);
            hasDelCount++;
            if (needDelCount == hasDelCount) {
                break;
            }
        }
    }
    subCount(obj);
    
    // 有增减操作时，需要重置tmpLables中的对象
    var count = $(obj).next().html()
    var shopProductId = $(obj).next().attr("id");
    var shopProductName = $(obj).next().attr("name");
    var price = $(obj).next().attr("price");
    var obj1 = createObject();
    obj1.shopProductId = shopProductId;
    obj1.shopProductName = shopProductName;
    price = parseFloat(price)*parseInt(count);
    obj1.count = count;
    obj1.price = price.toFixed(2);
    
    for (var n = 0; n < tmpLables.length; n++) {
        var obj2 = tmpLables[n];
        if (obj2.shopProductId == $(obj).next().attr("id")) {
            tmpLables.splice(n,1);
            break;
        }
    }
    if (count > 0) {
        tmpLables.push(obj1);
    }
    // 减少左侧菜单中的数量
    minusForLeftMenu(obj);
}

var tmpLables = new Array();
var layerIndex = 0;
var tmpObj = "";
// 增加数量
function plus(obj) {
    // 菜品是否有标签的标志
    var flag = false;
    tmpObj = obj;
    // 结构比较复杂，需要多层循环查找
    for (var i = 0; i < tempData.length; i++) {
        if (null != tempData[i].shopProducts) {
            for (var j = 0; j < tempData[i].shopProducts.length; j++) {
                var product = tempData[i].shopProducts[j];
                if (product.shopProductLableType!=null && product.shopProductId == $(obj).prev().attr("id")) {
                    var productLableType = product.shopProductLableType;
                    var tempLables = new Array();
                    for (var k = 0; k < productLableType.length; k++) {
                        tempLables.push("<div>");
                        tempLables.push(productLableType[k].lableTypeName);
                        tempLables.push("</div>");
                        var lableList = productLableType[k].lableList;
                        tempLables.push("<div>");
                        for (var m = 0; m < lableList.length; m++) {
                            tempLables.push("<span>");
                            var checked = "";
                            // 默认选中第一条
                            if (m == 0) {
                                checked = "checked";
                            }
                            tempLables.push("<input type='radio' "+checked+" id='"+lableList[m].splrId+"' name='"+productLableType[k].lableTypeName+"' value='"+product.shopProductId+"' oriPrice='"+product.discountPrice+"' premiumPrice='"+lableList[m].premium+"' onclick='changgePrice()' />");
                            tempLables.push("<span id='"+productLableType.length+"' name='"+product.productName+"' >"+lableList[m].lableName+"</span>");
                            tempLables.push("</span>&nbsp;");
                        }
                        tempLables.push("</div>");
                    }
                    tempLables.push("<span class='newPrice'>");
                    tempLables.push("0");
                    tempLables.push("</span>");
                    tempLables.push("<span>元</span>");
                    $('#taste_detail_div').empty();
                    $('#taste_detail_div').append(tempLables.join(""));
                    //页面层
                    layerIndex = layer.open({
                        type: 1,
                        content: $('#taste_div').html(),
                        anim: 0,
                        style: 'position:fixed; bottom:0; left:0; width:100%; height:150px; padding:10px 0; border:none;'
                    });
                    
                    // 默认计算一次价格
                    changgePrice();
                    flag = true;
                }
            }
        }
    }
    // 不需要选择口味等时，也要修改购物车的值
    if (!flag) {
        addCount(obj,null);
        // 有增减操作时，需要重置tmpLables中的对象
        var count = $(obj).prev().html()
        var shopProductId = $(obj).prev().attr("id");
        var shopProductName = $(obj).prev().attr("name");
        var price = $(obj).prev().attr("price");
        var obj1 = createObject();
        obj1.shopProductId = shopProductId;
        obj1.shopProductName = shopProductName;
        price = parseFloat(price)*parseInt(count);
        obj1.count = count;
        obj1.price = price.toFixed(2);
        
        if (count > 1) {
            for (var n = 0; n < tmpLables.length; n++) {
                var obj2 = tmpLables[n];
                if (obj2.shopProductId == $(obj).prev().attr("id")) {
                    tmpLables.splice(n,1);
                    break;
                }
            }
        }
        tmpLables.push(obj1);

        // 增加左侧菜单中的数量
        plusForLeftMenu(obj);
    }
}

// 减少左侧菜单中的数量
function minusForLeftMenu(obj) {
    var tagId = $(obj).attr("tagId");
    tagId = tagId + "_sup";
    $("li sup[id="+tagId+"]").each(function(i){
        if ($(this).html() == "1") {
            $(this).removeClass("left_menu_count");
            $(this).html("");
        } else {
            $(this).addClass("left_menu_count");
            $(this).html(parseInt($(this).html())-1);
        }
    });
    //$(".menuFooter").show();
}

//增加左侧菜单中的数量
function plusForLeftMenu(obj) {
 var tagId = $(obj).attr("tagId");
 tagId = tagId + "_sup";
 $("li sup[id="+tagId+"]").each(function(i){
     $(this).addClass("left_menu_count");
     if ($(this).html() == "") {
         $(this).html("1");
     } else {
         $(this).html(parseInt($(this).html())+1);
     }
 });
 $(".menuFooter").show();
}

// 修改标签时，需要修改相应的价格
function changgePrice() {
    var oriPrice = 0;
    var premiumPrice = 0;
    $('input[type="radio"]:checked').each(function(){
        oriPrice = $(this).attr("oriPrice");
        premiumPrice = parseFloat(premiumPrice) + parseFloat($(this).attr("premiumPrice"));
    });
    var price = parseFloat(oriPrice)+parseFloat(premiumPrice);
    $("#taste_detail_div span.newPrice").html(price.toFixed(2));
}

// 选择口味
function selectTaste() {
    var lableObjArray = new Array();
    var obj = createObject();
    var shopProductId = "";
    var shopProductName = "";
    var count = "";
    var oriPrice = 0;
    var premiumPrice = 0;
    $('input[type="radio"]:checked').each(function(){
        var lableObj = createLableObject();
        lableObj.splrId = $(this).attr("id");
        lableObj.lableName = $(this).next().html();
        lableObjArray.push(JSON.stringify(lableObj));
        
        oriPrice = $(this).attr("oriPrice");
        premiumPrice += parseFloat($(this).attr("premiumPrice"));
        shopProductId = $(this).attr("value");
        shopProductName = $(this).next().attr("name");
        count = 1;
    });
    obj.shopProductId = shopProductId;
    obj.shopProductName = shopProductName;
    obj.count = count;
    var price = parseFloat(oriPrice)+parseFloat(premiumPrice);
    obj.price = price.toFixed(2);
    obj.lable = lableObjArray;
    //tmpLables.push(JSON.stringify(obj));
    tmpLables.push(obj);
    
    //localStorage.lables = JSON.stringify(tmpLables);
    addCount(tmpObj,price);
    // 增加左侧菜单中的数量
    plusForLeftMenu(tmpObj);
    layer.close(layerIndex);
}

// 增加数量
function addCount(tmpObj,price) {
    var value = $(tmpObj).prev().html();
    $(tmpObj).prev().html(parseInt(value)+1);
    $('.class_li span').each(function(){
        if ($(this).attr("id") == ($(tmpObj).prev().attr("id")+"_span")) {
            if (null == price) {
                price = parseFloat($(this).html());
            }
            var tmpPrice = parseFloat($('#totalPrice').html());
            // 计算总价格
            $('#totalPrice').html((parseFloat(price)+parseFloat(tmpPrice)).toFixed(2));
            totalPrice = $('#totalPrice').html();
        }
    });
}

// 减少数量
function subCount(tmpObj) {
    $('.class_li span').each(function(){
        if ($(this).attr("id") == ($(tmpObj).next().attr("id")+"_span")) {
            var tmpPrice = parseFloat($(this).html());
            var price = parseFloat($('#totalPrice').html());
            // 计算总价格
            var p = (parseFloat(price)-parseFloat(tmpPrice)).toFixed(2);
            $('#totalPrice').html(p==0.00?0:p);
            totalPrice = $('#totalPrice').html();
        }
    });
}

// 创建一个对象，用于存放菜品标签
function createLableObject() {
    var obj = new Object();
    obj.splrId = "";
    obj.lableName = "";
    return obj;
}

// 菜品对象
function createObject() {
    var obj = new Object();
    obj.shopProductId = "";
    obj.shopProductName = "";
    obj.count = 0;
    obj.price = 0;
    obj.lable = new Array();
    return obj;
}

//点菜完毕，跳转到订单页面
function selectOK() {
    localStorage.lables = JSON.stringify(tmpLables);;
    if (null==tmpLables || tmpLables.length==0) {
        alert("请先选择菜品！");
        return;
    }    
    
    // 判断必选菜是否被选中，判断推荐菜是否被选中
    var hasRequiredFlag = false;
    var hasRecommendFlag = false;
    var requiredFlag = false;
    var recommendFlag = false;
    $('.class_li span').each(function(){
        if ("count_class" == $(this).attr("class")) {
            if ("REQUIRED" == $(this).attr("tagType")) {
                hasRequiredFlag = true;
                if ($(this).html() == 0) {
                    requiredFlag = true;
                }
            }
            if ("RECOMMEND" == $(this).attr("tagType")) {
                hasRecommendFlag = true;
                if ($(this).html() != 0) {
                    recommendFlag = true;
                }
            }
        }
    });
    if (hasRequiredFlag && requiredFlag) {
        alert("请选择所有的必选菜！");
        return;
    }
    if (hasRecommendFlag && !recommendFlag) {
        if (!confirm('当前店家有推荐菜品，是否选择?')) {
            window.location = "order.html";
        } else {
            return;
        }
    }
    window.location = "order.html";
}

function loadOrder() {
    var lables = JSON.parse(localStorage.lables);
    var tempLables = new Array();
    var price = 0;
    for (var i = 0; i < lables.length; i++) {
        var count = 0;
        var obj = lables[i];
        tempLables.push("<li id='"+obj.shopProductId+"' class='menu_li'>");
        tempLables.push("<div class='ui-grid-a' style='height:1.3em'>");
        tempLables.push("<div class='ui-block-a align_left' style='width:80%'>");
        tempLables.push("<p style='width: 100%;height:1.2em;word-break:break-all; word-wrap:break-word'>");
        tempLables.push(obj.shopProductName);
        
        var lable = obj.lable;
        if (null!=lable && lable.length>0) {
            tempLables.push("(");
            var lableName = "";
            for (var j = 0; j < lable.length; j++) {
                lableName += JSON.parse(lable[j]).lableName;
                if (j != lable.length-1) {
                    lableName += "/";
                }
            }
            tempLables.push(lableName);
            tempLables.push(")");
        }
        tempLables.push(" x"+obj.count);
        tempLables.push("</p>");
        tempLables.push("</div>");
        tempLables.push("<div class='ui-block-b align_right' style='width:20%'>");
        tempLables.push("<p>");
        tempLables.push("￥"+obj.price);
        tempLables.push("</p>");
        tempLables.push("</div>");
        tempLables.push("</div>");
        tempLables.push("</li>");
        
        price += parseFloat(obj.price);
    }
    tempLables.push("<li class='menu_li'>");
    tempLables.push("总额：<span id='orderTotalPrice'>");
    tempLables.push(price.toFixed(2));
    tempLables.push("</span>元");
    tempLables.push("</li>");
    $('#menu_list').append(tempLables.join(""));
    $('#menu_list').listview('refresh');
    $('#payPrice').html(price);
    // 用户钱包中的余额
    getBalance();
    
    // 店铺的优惠活动
    getSpecialOffer();
    
    // 如果已经登陆了，就不展示手机区域
    if (checkLogin()) {
        $('#mobileNumberDiv').hide();
    }
}

//获取钱包余额
function getBalance() {
    $.ajax({
        type : "GET",
        url  : urls.balance,
        cache : false,
        async : false,
        dataType : "json",
        data : {
            t : localStorage.token
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                $('#balance').html(data.data);
                // 初始化页面时，如果钱包余额大于买单金额，则不需要展示微信支付的按钮
                if ($('#balance').html() == 0) {
                    $('.ui-checkbox label').removeClass("ui-checkbox-on");
                    $('.ui-checkbox').hide();
                }
                if ($('#balance').html() > $('#payPrice').html()) {
                    $('.ui-radio label').removeClass("ui-radio-on");
                    $('.ui-radio').hide();
                }
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            } else if (data.code == "INVALID_SESSION") {
                //returnToLogin(getCurrentUrl());
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}

var specialOfferArray = new Array();
//店铺的优惠活动
function getSpecialOffer() {
    $('#specialOffer_list').empty();
    $.ajax({
        type : "POST",
        url  : urls.specialOffer+"/"+localStorage.shopId,
        cache : false,
        async: true,
        data : {
            t : localStorage.token,
            action : "CATERING"
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                specialOfferArray = data.data;
                var specialOfferLables = new Array();
                var presentLables = new Array();
                var tmpFlag = false;
                var tempAfterObj = null;
                // 这个钱是总额减去非优惠金额得到的
                var price = 0;
                if ($('#orderTotalPrice').attr("type") == "text") {
                    orderTotalPrice = parseFloat($('#orderTotalPrice').val());
                    inactiveAmount = $('#inactiveAmount').val();
                    if (!isNotEmpty(inactiveAmount)) {
                        inactiveAmount = 0;
                    }
                    price = (orderTotalPrice-inactiveAmount).toFixed(2);
                } else {
                	price = parseFloat($('#orderTotalPrice').html());
                }
                // 计算最优的优惠活动，需要默认选中
                var map = {};
                for (var i = 0; i < specialOfferArray.length; i++) {
                    var obj = specialOfferArray[i];
                    var type = "";
                    var specialOfferId = "";
                    // 过滤满足条件的优惠活动
                    if (price < obj.preconditionAmount) {
                        continue;
                    }
                    if (obj.type == "BEFORE_PAYMENT") {
                        type = obj.specialOfferTypeText;
                        specialOfferId = obj.specialOfferId;
                        if ("满减"==type || "立减" == type) {
                            map[specialOfferId] = parseFloat(obj.postconditionAmount);
                        } else if ("满折"==type || "立折" == type) {
                            var postconditionAmount = parseFloat(obj.postconditionAmount);
                            var afterPrice = (price*parseFloat(1-postconditionAmount*0.1)).toFixed(2);
                            map[specialOfferId] = parseFloat(afterPrice);
                        } else if ("满送菜" == type) {
                            map[specialOfferId] = parseFloat(0);
                        }
                    }
                }
                var tempPrice = 0;
                var tempSpecialOfferId = "";
                for (var prop in map){
                    if (map.hasOwnProperty(prop)) {
                        if (map[prop] >= tempPrice) {
                            tempPrice = map[prop];
                            tempSpecialOfferId = prop;
                        }
                    }
                }
                
                for (var i = 0; i < specialOfferArray.length; i++) {
                    var obj = specialOfferArray[i];
                    // 过滤满足条件的优惠活动
                    if (price < obj.preconditionAmount) {
                        continue;
                    }
                    if (obj.type == "BEFORE_PAYMENT") {
                        // 只展示最优的活动，一个
                        if (tempSpecialOfferId != obj.specialOfferId) {
                            continue;
                        }
                        specialOfferLables.push("<li id='"+obj.specialOfferId+"' class='coupon_li'>");
                        specialOfferLables.push("<label>");
                        specialOfferLables.push("<div class='ui-grid-a' style='height:1.4em'>");
                        specialOfferLables.push("<div class='ui-block-a align_left' style='width:80%'>");
                        specialOfferLables.push("<p style='width: 100%;height:1.3em;word-break:break-all; word-wrap:break-word'>");
                        specialOfferLables.push(obj.name);
                        specialOfferLables.push("</p>");
                        specialOfferLables.push("</div>");
                        specialOfferLables.push("<div class='ui-block-b align_right' style='width:20%'>");
                        specialOfferLables.push("<p>");
                        specialOfferLables.push("<input type='radio' checked id='"+obj.specialOfferId+"' name='BEFORE_PAYMENT'" +
                                " preconditionAmount='"+obj.preconditionAmount+"' postconditionAmount='"+obj.postconditionAmount+"' " +
                                " repeatCount='"+obj.repeatCount+"'" +
                                " value='"+obj.specialOfferTypeText+"' onclick='calcPrice()' />");
                        specialOfferLables.push("</p>");
                        specialOfferLables.push("</div>");
                        specialOfferLables.push("</div>");
                        specialOfferLables.push("</label>");
                        specialOfferLables.push("</li>");
                    }
                }
                $('#specialOffer_list').append(specialOfferLables.join(""));
                $('#specialOffer_list').listview('refresh');
                calcPrice();
                // 用户当前可用的优惠券
                getUserCoupons();
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}

// 选择了优惠等，需要重新计算应付金额
function calcPrice() {
    var orderTotalPrice = 0;
    var inactiveAmount = 0;
    if ($('#orderTotalPrice').attr("type") == "text") {
        orderTotalPrice = parseFloat($('#orderTotalPrice').val());
        inactiveAmount = $('#inactiveAmount').val();
        if (!isNotEmpty(inactiveAmount)) {
            inactiveAmount = 0;
        }
        orderTotalPrice = orderTotalPrice - inactiveAmount;
    } else {
        orderTotalPrice = parseFloat($('#orderTotalPrice').html());
    }
    var beforePrice = 0;
    var couponPrice = 0;
    var afterPrice = 0;
    $('input:radio[name="BEFORE_PAYMENT"]:checked').each(function(){
        var preconditionAmount = parseFloat($(this).attr("preconditionAmount"));
        var postconditionAmount = parseFloat($(this).attr("postconditionAmount"));
        var repeatCount = parseInt($(this).attr("repeatCount"));
        var type = $(this).val();
        if ("满减" == type) {
            var count = 0;
            if (orderTotalPrice >= preconditionAmount) {
                if (repeatCount == 1) {
                    beforePrice = postconditionAmount;
                } else if (repeatCount > 1) {
                    count = parseInt(orderTotalPrice/preconditionAmount >= repeatCount ? repeatCount : orderTotalPrice/preconditionAmount);
                    beforePrice = postconditionAmount * count;
                }
            }
        } else if ("满折" == type) {
            if (orderTotalPrice >= preconditionAmount) {
                beforePrice = (orderTotalPrice*parseFloat(1-postconditionAmount*0.1)).toFixed(2);
            }
        } else if ("立减" == type) {
            beforePrice = postconditionAmount;
        } else if ("立折" == type) {
            beforePrice = (orderTotalPrice*parseFloat(1-postconditionAmount*0.1)).toFixed(2);
        }
    });
    $('input:checkbox[name="userCoupons"]:checked').each(function(){
        couponPrice += parseFloat($(this).val());
    });
    
    // 买单赠送列表
    getPresentList();
    
    // 这是实际要付的钱（包含钱包中的余额）
    var price = (parseFloat(orderTotalPrice)-parseFloat(beforePrice)-parseFloat(couponPrice)-parseFloat(afterPrice)+parseFloat(inactiveAmount)).toFixed(2);
    if (price < 0) {
        price = 0;
    }
    var balancePrice = parseFloat($('#balance').html());
    if (balancePrice == 0) {
        $('#payPrice').html(price);
        $('.ui-radio label').addClass("ui-radio-on");
        $('#weixin').attr("checked", "checked");
        $('.ui-radio').show();
    } else if (price <= balancePrice) {
        $('#payPrice').html("0");
        $('.ui-radio label').removeClass("ui-radio-on");
        $('#weixin').removeAttr("checked");
        $('.ui-radio').hide();
    } else {
        $('#payPrice').html((price-balancePrice).toFixed(2));
        $('.ui-radio label').addClass("ui-radio-on");
        $('#weixin').attr("checked", "checked");
        $('.ui-radio').show();
    }
}

//用户当前可用的优惠券
function getUserCoupons() {
    $('#coupon_list').empty();
    $.ajax({
        type : "POST",
        url  : urls.userCoupons,
        cache : false,
        data : {
            t : localStorage.token,
            shopId : localStorage.shopId,
            action : "CATERING"
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                var temp = data.data;
                var payPrice = $('#payPrice').html();
                var couponLables = new Array();
                for (var i = 0; i < temp.length; i++) {
                    var obj = temp[i];
                    // 只展示满足条件的优惠券
                    if (payPrice < obj.couponBean.preconditionAmount) {
                        continue;
                    }
                    // 当优惠券与活动不共存时，不能展示此优惠券
                    if ($('#specialOffer_list').html().length!=0
                            && obj.couponBean.isActivityCoexist==false) {
                        continue;
                    }
                    couponLables.push("<li id='"+obj.couponBean.couponId+"' class='coupon_li' >");
                    couponLables.push("<label>");
                    couponLables.push("<div class='ui-grid-a' style='height:1.4em'>");
                    couponLables.push("<div class='ui-block-a align_left' style='width:80%'>");
                    couponLables.push("<p style='width: 100%;height:1.3em;word-break:break-all; word-wrap:break-word'>");
                    couponLables.push(obj.couponBean.title);
                    if (!obj.couponBean.isCoexist) {
                        couponLables.push("(不可叠加)");
                    }
                    couponLables.push("</p>");
                    couponLables.push("</div>");
                    couponLables.push("<div class='ui-block-b align_right' style='width:20%'>");
                    couponLables.push("<p>");
                    var checked = "";
                    if (i == 0) {
                        checked = "checked";
                    }
                    couponLables.push("<input type='checkbox' "+checked+" id='"+obj.userCouponId+"' name='userCoupons' " +
                            " iscoexist='"+obj.couponBean.isCoexist+"' " +
                            " value='"+obj.couponBean.amount+"' onclick='setCouponCoexist(this);calcPrice()' />");
                    couponLables.push("</p>");
                    couponLables.push("</div>");
                    couponLables.push("</div>");
                    couponLables.push("</label>");
                    couponLables.push("</li>");
                }
                $('#coupon_list').append(couponLables.join(""));
                $('#coupon_list').listview('refresh');
                calcPrice();
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}

function setCouponCoexist(obj) {
    if ($(obj).attr("iscoexist") == "false") {
        $('input:checkbox[name="userCoupons"]').each(function(){
            if ($(this).attr("id") == $(obj).attr("id")) {
                $(this).attr("checked", "checked");
            } else {
                $(this).removeAttr("checked");
            }
        });
    } else {
        $('input:checkbox[name="userCoupons"]').each(function(){
            if ($(this).attr("iscoexist") == "false") {
                $(this).removeAttr("checked");
            }
        });
    }
}

// 设置买单赠送，根据实际的买单金额而变化
function getPresentList() {
    $('#present_list').empty();
    var presentLables = new Array();
    var tmpFlag = false;
    for (var i = 0; i < specialOfferArray.length; i++) {
        var obj = specialOfferArray[i];
        if ($('#payPrice').html() < obj.preconditionAmount) {
            continue;
        }
        if (obj.type == "AFTER_PAYMENT") {
            presentLables.push("<li id='"+obj.specialOfferId+"' class='present_li'>");
            presentLables.push("<label>");
            presentLables.push("<div class='ui-grid-a' style='height:1.4em'>");
            presentLables.push("<div class='ui-block-a align_left' style='width:80%'>");
            presentLables.push("<p style='width: 100%;height:1.3em;word-break:break-all; word-wrap:break-word'>");
            presentLables.push(obj.name);
            presentLables.push("</p>");
            presentLables.push("</div>");
            presentLables.push("<div class='ui-block-b align_right' style='width:20%'>");
            presentLables.push("<p>");
            var checked = "";
            // 第一次进来时，tmpFlag为false，即设置第一个为选中状态
            if (!tmpFlag) {
                checked = "checked";
            }
            tmpFlag = true;
            presentLables.push("<input type='radio' "+checked+" id='"+obj.specialOfferId+"' name='AFTER_PAYMENT' " +
                    " preconditionAmount='"+obj.preconditionAmount+"' postconditionAmount='"+obj.postconditionAmount+"' " +
                    " value='"+obj.specialOfferTypeText+"' />");
            presentLables.push("</p>");
            presentLables.push("</div>");
            presentLables.push("</div>");
            presentLables.push("</label>");
            presentLables.push("</li>");
        }
    }
    $('#present_list').append(presentLables.join(""));
    $('#present_list').listview('refresh');
}

function createDishesObj() {
    var obj = new Object();
    obj.shopProduct = createShopProductsObj();
    obj.price = 0;
    obj.money = 0;
    obj.quantity = 0;
    obj.splrIds = "";
    return obj;
}

function createShopProductsObj() {
    var obj = new Object();
    obj.shopProductId = "";
    return obj;
}

/**
 * <pre>
 * 点菜
 * 请求例子：/api/order/place-order?t=Token&amp;totalAmount=实际消费金额&amp;shopId=店
 * </pre>
 * 
 * @param token [NOT NULL]
 * @param dishes [NOT NULL] 菜单json字符串，格式demo：[{ "shopProduct": { "shopProductId": "1276503635c611e59d82000c29b26a4e" }, "price": 23.00, "money": 21.00, "quantity": 2,"splrIds":"1,2" }]
 * @param totalAmount [NOT NULL] 实际消费金额
 * @param shopId [NOT NULL] 店ID
 * @param peopleNumber [NULL] 人数
 * @param tableNumber [NULL] 桌号
 * @param orderRemark [NULL] 订单备注
 * @param specialOfferIds [NULL] 参与了的优惠活动Id
 * @param couponIds [NULL] 使用了的券Id
 * @param inactiveAmount [NULL] 非优惠金额，只限没菜单的时候
 * @param refOrderId [NULL] 原订单号
 * @return
 */
function placeOrder() {
    setBtnStatus($('#payBtn'));
    $('#errMsg').html();
    var lables = JSON.parse(localStorage.lables);
    var tempArray = new Array();
    for (var i = 0; i < lables.length; i++) {
        var dishesObj = createDishesObj();
        var obj = lables[i];
        var shopProductsObj = createShopProductsObj();
        shopProductsObj.shopProductId = obj.shopProductId;
        dishesObj.shopProduct = shopProductsObj;
        dishesObj.price = obj.price;
        dishesObj.money = obj.price;
        dishesObj.quantity = obj.count;
        var lable = obj.lable;
        var splrId = "";
        if (null!=lable && lable.length>0) {
            var lableId = "";
            for (var j = 0; j < lable.length; j++) {
                splrId += JSON.parse(lable[j]).splrId;
                if (j != lable.length-1) {
                    splrId += ",";
                }
            }
        }
        dishesObj.splrIds = splrId;
        tempArray.push(dishesObj);
    }
    var specialOfferIds = new Array();
    $('input:radio[name="BEFORE_PAYMENT"]:checked').each(function(){
        specialOfferIds.push($(this).attr("id"));
    });
    $('input:radio[name="AFTER_PAYMENT"]:checked').each(function(){
        specialOfferIds.push($(this).attr("id"));
    });
    var couponIds = new Array();
    $('input:checkbox[name="userCoupons"]:checked').each(function(){
        couponIds.push($(this).attr("id"));
    });
    var peopleNumber = $('#peopleNumber').val();
    var re = /^[1-9]+[0-9]*]*$/;
    if (!isNotEmpty(peopleNumber)) {
        $('#peopleNumber').val("");
    } else {
        if (!re.test(peopleNumber)) {
            $('#errMsg').html("人数只能为数字!");
            $('#peopleNumber').val("");
            $('#payBtn').button("enable");
            return;
        }
    }
    
    // 先判断有没有登陆
    if (!checkLogin()) {
        // 没有登陆时，才允许输入手机号码
        var mobileNumber = $('#mobileNumber').val();
        if (!isNotEmpty(mobileNumber)) {
            $('#errMsg').html("手机号码不能为空！");
            $('#mobileNumber').val("");
            return;
        }
        if (!validTelNum(mobileNumber)) {
            $('#errMsg').html("请输入合法的手机号码(11位)！");
            $('#mobileNumber').val("");
            return;
        }
        
        // 判断账户是否存在
        var userBean = checkAccountExist(mobileNumber)
        if (null == userBean) {
            // 账号不存在，需要先注册
            userBean = registerByH5(mobileNumber);
        }
        // 修改token的值为userId
        if (null != userBean) {
            getTempToken(userBean.userId)
        }
    }
    
    $.ajax({
        type : "POST",
        url  : urls.placeOrder,
        cache : false,
        dataType:"json",
        data : {
            t : localStorage.token,
            dishes : JSON.stringify(tempArray),
            totalAmount : $('#orderTotalPrice').html(),
            shopId : localStorage.shopId,
            peopleNumber : $('#peopleNumber').val(),
            tableNumber : $('#tableNumber').val(),
            orderRemark : $('#orderRemark').val(),
            specialOfferIds : specialOfferIds.join(","),
            couponIds : couponIds.join(","),
            inactiveAmount : "",
            refOrderId : ""
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                var orderId = data.data.userOrderBean.userOrderId;
                setValue("orderId", orderId);
                setValue("payMoney", $('#payPrice').html());
                // 付款方式（钱包余额、微信）
                if ($('.ui-radio label').hasClass("ui-radio-on")) {
                    window.location.href= wechatUrl;
                } else {
                    paymentOrderByWallet(orderId);
                }
                
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            } else if (data.code == "INVALID_SESSION") {
                returnToLogin(getCurrentUrl());
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}
