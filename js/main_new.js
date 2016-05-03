/**
 * Created by huaka on 2016-04-22.
 */
 $(function() {
 	var shopListVue = new Vue({
    el: '#shopList',
    data: {
       shops: []
    },
    methods: {
	    loadShopList: function (mainPageIndex,keyWords) {
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
		                var c_shop = data.data;
		                shops = c_shop;
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
	  	}
  }
});
 });
