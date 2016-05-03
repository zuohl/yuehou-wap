function getAuthCode() {
    $('#errMsg').html("");
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
    $.ajax({
        type : "POST",
        url  : urls.getAuthCode,
        cache : false,
        async: false,
        dataType:"json",
        data : {
            mobileNumber:$('#mobileNumber').val()
        },
        success : function(data) {
            if (data.code == "SUCCESS") {
                $('#errMsg').html("");
            } else if (data.code == "BUSINESS_ERROR"){
                $('#errMsg').html(data.msg)
            } else if (data.code == "INVALID_SESSION") {
                returnToLogin("previousPage=myInfo.html");
            }
        }
    });
    settime();
}

function register() {
    $('#errMsg').html("");
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
    var authCode = $('#authCode').val();
    if (!isNotEmpty(authCode)) {
        $('#errMsg').html("验证码不能为空！");
        $('#authCode').val("");
        return;
    }
    var pwd = $('#pwd').val();
    if (!isNotEmpty(pwd)) {
        $('#errMsg').html("密码不能为空！");
        $('#pwd').val("");
        return;
    }
    $.ajax({
        type : "POST",
        url  : urls.register,
        cache : false,
        async: true,
        data : {
            mobileNumber : mobileNumber,
            authCode : authCode,
            password : $.md5(pwd),
            loginSource:"WAP"
        },
        success : function(data) {
            if (data.code == "SUCCESS") {
                alert("操作成功!");
                window.location = "userLogin.html";
            }
            else if (data.code == "BUSINESS_ERROR"){
                $('#errMsg').html(data.msg);
            }
        }
    });
}