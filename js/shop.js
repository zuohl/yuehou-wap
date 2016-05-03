/**
 * Created by zuohl on 2016/1/18.
 */
function getShopDetails(shopId) {
    $.ajax({
        type : "get",
        url  : urls.shopDetails+shopId,
        cache : true,
        async: false,
        dataType: "json",
        beforeSend: function () {
            showLoader("正在加载店详情");
        },
        complete:function(){
            hideLoader();
        },
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                var shopDetails = data.data;
                var businessHour = "";
                if (shopDetails.businessHours != null && isNotEmpty(shopDetails.businessHours)) {
                    businessHour = shopDetails.businessHours;
                    if(shopDetails.businessHours2 != null) {
                        businessHour = businessHour + ","+ shopDetails.businessHours2;
                    }
                }
                else {
                    businessHour = "24小时营业";
                }
                $("#businessHour").text(businessHour);
                $("#addressName").text(shopDetails.address);
                $("#mobilePhone").attr("href","tel:"+shopDetails.phone);
                var gps = GPS.bd_decrypt(shopDetails.baiduLatitude,shopDetails.baiduLongitude);
                $("#address").on("tap",function(){
                    openLocation(gps.lat,gps.lon,shopDetails.name,shopDetails.address);
                });
                $("#shopService").html(shopDetails.service);
                $("#description").html(shopDetails.description);
                var subTagName = new Array;
                $.each(shopDetails.categorySubTags,function(index,item) {
                    subTagName.push(item.name);
                });
                $(".subTags").html(subTagName.join("<br>"));
                var imgUrl = shopDetails.logo;
                var background = "url("+imgUrl+")";
                //var background = "url("+imgUrl+")"+" no-repeat 0 0;";
               $("#categorySubTags").css("background",background);
               $("#categorySubTags").css("background-size","100% 100%");
            }
        }
    });
}

function hotCityList() {
	 $.ajax({
        type : "GET",
        url  : urls.hotCity,
        cache : true,
        async: false,
        dataType:"json",
        success : function(data,code) {
            if (data.code == "SUCCESS") {
                var temp = data.data;
                var lables = new Array();            
            } else if (data.code == "BUSINESS_ERROR") {
                alert(data.msg);
            }
        },
        error : function(data,code) {
            alert(data.msg);
        }
    });
}

function getCurrentCity() {
    var currentCity = "深圳";
    //var url = "http://api.map.baidu.com/geocoder/v2/?ak=bOHGSFYg4sgxpUoiZrETMMtT&callback=renderReverse&location=39.983424,116.322987&output=json";
    var url = "http://api.map.baidu.com/geocoder/v2/";
    $.ajax({
        type:"get",
        data:{
            ak:"bOHGSFYg4sgxpUoiZrETMMtT",
            location:getValue("latitude")+","+getValue("longitude"),
            output:"json",},
        url:url,
        dataType:"jsonp",
        jsonp:"callback",
        success:function(data){
            if (data.status == "0") {
                var city = data.result.addressComponent.city;
                if(isNotEmpty(city)) {
                    currentCity = city.replace("市","");
                }
            }
        }
    });
    return currentCity;
}

