var hostname = 'https://isomerstage.btspulse.com';
var ignoreMultipleLogins = false;
var loginResp = {};
(function (global) {

  var name, authCode, emailId, token;
 

  global.auth = function (user, pass, token) {

    if (!user)
      user = global.$('#email').val();
    if (!pass)
      pass = global.$('#pass').val()

    var user = {
      email: user,
      password: pass,
      eventTitle: 'CoverMyMeds_BA1Lite_PulseEvent'
    }
    if (token) {
      user.token = token;
    }

    var settings = {
      data: user,
      type: 'POST',
      url: hostname + '/Wizer/Authentication/CloudFrontLogin',
      xhrFields: {
        withCredentials: true
      }
    };
    $(':input[type="submit"]').prop('disabled', true);
    $('.processing').show();
    global.$
    .ajax(settings)
      .then(function (resp) {
        if (resp.success) {
          loginResp = resp;
          // resp.isAlreadyLoggedIn = true;
          // Check already user loggin
          if (resp.isAlreadyLoggedIn && !ignoreMultipleLogins) {
            $('.loggedin-body-email').text(resp.pemail);
            $('#form1').hide();

            $('#form8').show();

            return false;
          }
          userAlreadyNotLoggedIn();
        } else {
          console.log(resp);
          if(settings.data.email || settings.data.password) {
            global.$("#loginErrorMessage").text("Error: " + resp.errMsg);
          }
          global.$('#loginBox').show();
        }
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      })
      .catch(function (err) {
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
        global.$("#loginErrorMessage").text("Execution error");
        global.$('#loginBox').show();
      });
  };

  global.authRegister = function () {
    name = global.$('#name').val();
    authCode = global.$('#authCode').val();
    emailId = global.$('#emailId').val();

    if (!name || name.split(' ').join('') == '') {
      global.$("#regErrorMessage").text("Please a valid username");
      return;
    } else {
      global.$("#regErrorMessage").text('');
    }

    var user = {
      name: name,
      eventCode: authCode,
      email: emailId
    };
    var settings = {
      data: user,
      type: 'POST',
      url: hostname + '/Wizer/CloudFront/SelfRegistration',
      xhrFields: {
        withCredentials: true
      }
    }
    $(':input[type="submit"]').prop('disabled', true);
    $('.processing').show();
    global.$
    .ajax(settings)
      .then(function (resp) {
        if (resp.success && resp.message === 'User self-registered successfully.') {
          localStorage.setItem('user', JSON.stringify(resp));
          for (var key in resp.cookies) {
            // .NET doesn't allow - in keynames, so _ are used instead.
            global.Cookies.set(key.replace(/_/g, '-'), resp.cookies[key])
          }
          global.$("#success").text('Authentication Success. You may proceed to the app')
          if (resp.languageResponse) {           
            loadLanguages(resp, resp.languageResponse);
          }
        } else if (resp.success === false &&
          (resp.message === 'Event code exists.' || resp.message === 'Email Required')) {
          switchToEmail();
        } else {
          global.$('#regErrorMessage').text('Error: ' + resp.message)
        }
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      })
      .catch(function (err) {
        global.$("#regErrorMessage").text("Execution error");
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      });
  };

  global.authEmail = function () {
    emailId = global.$('#regemailId').val();

    var user = {
      name: name,
      eventCode: authCode,
      email: emailId
    };
    var settings = {
      data: user,
      type: 'POST',
      url: hostname + '/Wizer/CloudFront/SelfRegistration',
      xhrFields: {
        withCredentials: true
      }
    };
    $(':input[type="submit"]').prop('disabled', true);
    $('.processing').show();
    global.$.ajax(settings)
      .then(function (resp) {
        if (resp.success && resp.message === 'Email sent successfully.') {
          switchToEmailSent();
        } else {
          global.$('#emailRegErrorMessage').text('Error: ' + resp.message)
        }
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      })
      .catch(function (err) {
        global.$('#emailRegErrorMessage').text('Execution error');
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      });
  };

  global.authNewPassword = function () {

    password = global.$('#newPwd').val();

    if (!password || password.split(' ').join('') == "") {
      global.$('#newPwdErrorMessage').text('Please a valid password');
      return;
    } else {
      global.$('#newPwdErrorMessage').text('');
    }

    var data = {
      token: token,
      password: password
    };
    var settings = {
      data: data,
      type: 'POST',
      url: hostname + '/Wizer/CloudFront/Register',
      xhrFields: {
        withCredentials: true
      }
    };

    $(':input[type="submit"]').prop('disabled', true);
    $('.processing').show();
    global.$
    .ajax(settings)
      .then(function (resp) {
        if (resp.success) {
          global.$('#newPwdAuth').hide();
          global.$('#backToLogin').show();
        } else {
          global.$('#newPwdErrorMessage').text('Error: ' + resp.message)
        }
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      })
      .catch(function (err) {
        global.$('#newPwdErrorMessage').text('Execution error');
        $(':input[type="submit"]').prop('disabled', false);
        $('.processing').hide();
      });
  };

  global.capLock = function (e) {
    if (document.msCapsLockWarningOff == false) {
      document.msCapsLockWarningOff = true;
    }

    if (e.type == 'keyup') {
      if (event.getModifierState('CapsLock')) {
        document.getElementById('divCapsWarn').style.visibility = 'visible';
      } else {
        document.getElementById('divCapsWarn').style.visibility = 'hidden';
      }
    } else {
      kc = e.keyCode ? e.keyCode : e.which;
      sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
      if (((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk))
        document.getElementById('divCapsWarn').style.visibility = 'visible';
      else
        document.getElementById('divCapsWarn').style.visibility = 'hidden';
    }

  };


  global.switchToLogin = function () {
    $('#auth-login')[0].reset();
    $('#form1').show();
    $('#form2').hide();
    $('#form3').hide();
    $('#form4').hide();
    $('#form5').hide();
  }

  global.switchToRegister = function () {
    $('#form1').hide();
    $('#form2').show();
    $('#form3').hide();
    $('#form4').hide();
    $('#form5').hide();
  }

  global.switchToEmail = function () {
    $('#form1').hide();
    $('#form2').hide();
    $('#form3').show();
    $('#form4').hide();
    $('#form5').hide();
  }

  global.switchToEmailSent = function () {
    $('#form1').hide();
    $('#form2').hide();
    $('#form3').hide();
    $('#form4').show();
    $('#form5').hide();
  }

  global.switchToForgotPassword = function () {
    $('#form1').hide();
    $('#form2').hide();
    $('#form3').hide();
    $('#form4').hide();
    $('#form5').show();
  }

  global.resetForm = function () {
    $('#registration')[0].reset();
  };



    // for (var i = 0; i < 1; i++) {
    //   if ( === 'true') {
    //     return true;
    //   }
    // }
    // return false;
  


  
  // global.onUserNameFocus = function () {
  //   let inputRef = document.getElementById('usernameLabel');
  //   setInputStyling(inputRef);
  // };

  // global.onPasswordFocus = function () {
  //   let inputRef = document.getElementById('passwordLabel');
  //   setInputStyling(inputRef);
  // };

  // function setInputStyling(inputRef) {
  //   inputRef.style.fontSize = '11px'
  //   inputRef.style.color = '#fff';
  //   inputRef.style.top = '-15px';
  //   inputRef.style.left = '0px';
  //   inputRef.style.transition = 'top 1s, left 1s';
  // }

  function getRequests() {
    global.$('#loginBox').hide();
    var s1 = location.href.substring(1, location.href.length).split('&'),
      r = [],
      s2,
      i;
    for (i = 0; i < s1.length; i += 1) {
      s2 = s1[i].split('=');
      var key = decodeURIComponent(s2[0]);
      if (key.indexOf('?') > 0) {
        key = key.substring(key.indexOf('?') + 1, key.length);
      }
      r.push(decodeURIComponent(s2[1]));
    }
    return r;
  }

  function getQueryParams() {
    var paramString = location.href.split('?')[1];
    var params = [],
    paramArray = [];
    if (paramString) {
      params = paramString.split('&');
      if (params && params.length > 0) {
        for (i = 0; i < params.length; i++) {
          var paramObject = {};
          var splitted = params[i].split('=');
          paramObject[splitted[0]] = splitted[1];
          paramArray.push(paramObject);
        }
      }
    }
    return paramArray;
  }

  function showForgotPassword(params) {
    for (var i = 0; i < params.length; i++) {
      if (params[i]['forgotpwd'] === 'true') {
        return true;
      }
    }
    return false;
  }
  global.userAlreadyNotLoggedIn = function () {
    var resp = loginResp;
    localStorage.setItem('user', JSON.stringify(resp));
    for (var key in resp.cookies) {
      // .NET doesn't allow - in keynames, so _ are used instead.
      global.Cookies.set(key.replace(/_/g, '-'), resp.cookies[key]);
    }
    global.$('#success').text('Authentication Success. You may proceed to the app');
    


      // Bind Data if language is available
      if (resp.languageResponse) {
        loadLanguages(resp, resp.languageResponse);
      }
    
  }

  function loadLanguages(obj, languageObj) {
    if (obj.planguagekey == null || !(languageObj.hasConsent)) {
      $('#form1').hide();
      $('#form2').hide();
      $('#form8').hide();
      $('#form6').hide();
    if (languageObj.languages && languageObj.languages.length > 0) {
        
        languageList = languageObj.languages;
        var option = '';
        for (let i = 0; i < languageObj.languages.length; i++) {
            option +=
                '<li class="option dropdown-item" data-value="value ' + i + '" value=' +
                i +
                '>' +
                languageObj.languages[i].languageDescription +
                '</li>';
        }
        $('#languageData').append(option);
       
    }


    if (languageList.length === 1) {
      selectLang = 0;
				if(languageObj.requiresConsent){
          loadPricyPolicy();
        }else{
					localStorage.setItem('languageSelect', true);
					reloadToLogin()
				}
    }else if(languageList.length > 1){
      //Show language selection form
      $('#form1').hide();
      $('#form2').hide();
      $('#form8').hide();
      $('#form6').show();
    }
  } else {
    localStorage.setItem('languageSelect', true);
    // window.location.href = '/';
    reloadToLogin()
    }
}
function reloadToLogin(){
  var iOS = /(iPad|iPhone|iPod|Macintosh)/g.test(navigator.userAgent);
  if (iOS) {
    console.log('iOS device found');
    //window.location = "/";
    if (window && window.location && window.location.reload) {
      window.location.reload();
    }
  } else {
    console.log('not iOS');
    window.location.href = '/';
  }
}

global.checkNameSpecialChars = function () {
    $('#name').on('keypress', function (event) {
        isSpecialCharacter(event, "^[a-zA-Z \b]+$");
    });
};

global.checkEmailSpecialChars = function () {
    $('#emailId').on('keypress', function (event) {
        isSpecialCharacter(event, "^[0-9a-zA-Z.@'_\b]+$");
    });
};

global.invalidMsg = function(input) {
  switch(input.id) {
    case 'email':
      if (input.value.trim() === '') {
        input.setCustomValidity('Enter Username');
      } else {
        input.setCustomValidity('');
      }
      break;
    case 'pass':
      if (input.value === '') {
        input.setCustomValidity('Enter Password');
      } else {
        input.setCustomValidity('');
      }
      break;  
  }
  
}

function isSpecialCharacter(event, regEx) {
    var regex = new RegExp(regEx);
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
};

addAboutModal();

  var QueryString = getRequests();
  var QueryParams = getQueryParams();
  console.log(QueryString[0]);
  token = QueryString[0];
  var found = QueryString[0];

  //if (QueryParams.length > 0) {
  //  global.$('#loginBox').show();
  //  if (showForgotPassword(QueryParams)) {
  //    global.switchToForgotPassword();
  //  }
  //} else {
  if (found && found != 'undefined' && found != undefined) {
    console.log('recieved call from LTI/LMS');
    auth('', '', QueryString[0]);
    console.log('finished the re-route process');
  } else {
    global.$('#loginBox').show();
  }
  //}
})(window);

function setCredentialsFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');
  const password = params.get('password');

  if (username) {
    $('#email').val(username);
  }
  if (password) {
    $('#pass').val(password);
  }

  if (username && password) {
    $('#login').click();
  }
}

$(document).ready(function() {
  logout();

  // $('ul').on('click', '.init', function() {
	// 	$(this).closest('#languageData').children('li:not(.init)').slideDown();
	// 	$('.downIcon').hide();
	// 	$('.upIcon').show();
	// });

	// $('ul').on('click', '.downIcon', function() {
	// 	$(this).closest('#languageData').children('li:not(.init)').slideUp();
	// 	$('.upIcon').hide();
	// 	$('.downIcon').show();
	// });

	var allOptions = $('#languageData').children('li:not(.init)');
	$('#languageData').on('click', 'li:not(.init)', function() {
		allOptions.removeClass('selected');
		$(this).addClass('selected');
		selectLang = $(this).val();
    $('#selectedLanguageText')[0].innerText = $(this)[0].innerText; 
		console.log(selectLang);
		// $('#languageData').children('.init').html($(this).html());
		// allOptions.slideUp();
		// $('.option').hide();
		$('.downIcon').show();
		$('.upIcon').hide();
		$('#languageError').text('');
	});

	$('#languageButton').click(function() {
		if (selectLang === -1) {
			$('#languageError').text('Please select language');
		} else {
      // loadPricyPolicy();
      if(loginResp && loginResp.languageResponse && loginResp.languageResponse.requiresConsent){
				//requires consent is ON
				loadPricyPolicy();
			}else{
				localStorage.setItem('languageSelect', true);
				reloadToLogin()
			}
		}
	});

	$('#declineButton').click(function() {
		localStorage.clear();
		// window.location.reload();
		logout();
	});

	$('#acceptButton').click(function() {
		// window.location.href = "./";
		var url = hostname + '/Wizer/Authentication/UserAgreement';
		var settings = {
			data: {
				languageKey: languageList[selectLang].languageKey
			},
			type: 'POST',
			url: url,
			xhrFields: {
				withCredentials: true
			}
		};
		$.ajax(settings)
			.then(function(resp) {
				if (resp.success) {
          localStorage.setItem('languageSelect', true);
					// window.location.href = '/';
          reloadToLogin()
				}
			})
			.catch(function(err) {
				console.log(err);
			});
	});

	function deleteAllCookies() {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf('=');
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}

	function logout() {
		deleteAllCookies();
		var url = hostname + '/Wizer/CloudFront/Logout';
		var settings = {
			type: 'POST',
			url: url,
			xhrFields: {
				withCredentials: true
			}
		};
		$.ajax(settings)
			.then(function(resp) {
				if (resp.success) {
					localStorage.clear();
					window.location.reload();
        } else {
          localStorage.clear();
				}
			})
			.catch(function(err) {
				console.log(err);
			});
	}
  
  $('#logoutAlreadyLoggedIn').click(function () {
    logout();
  })

  setCredentialsFromQueryParams();
});

function loadPricyPolicy() {
  var changeLang = JSON.parse(localStorage.getItem('user'));
  changeLang.planguagekey = languageList[selectLang].languageKey
  localStorage.setItem('user', JSON.stringify(changeLang));
  $('#form6').hide();
  $('#form7').show();
  $('#privacyHeader').html(languageList[selectLang].ecHeader)
  $('#privacyText').html(languageList[selectLang].ecText)
  $('#acceptButton').html(languageList[selectLang].ecAcceptButton + '<i class="fa fa-check privacyIcon" aria-hidden="true"></i>')
  $('#declineButton').html(languageList[selectLang].ecDeclineButton + '<i class="fa fa-times privacyIcon" aria-hidden="true"></i>')
}

//to display about tab
window.onload = function(){
  const aboutModal = document.getElementById("aboutModal");
  const overlay = document.getElementById("overlay");

  const anchTags = document.querySelectorAll('.anchorTag');
  const copyCodebtn = document.getElementById('copyCodebtn');
  const DD_URL = document.getElementById('DD_URL');

  anchTags[0].innerHTML = hostname+'/wizer' ;
  anchTags[0].setAttribute("href",hostname+'/wizer');
  anchTags[1].innerHTML = hostname+'/wizer/vote/monitor' ;
  anchTags[1].setAttribute("href",hostname+'/wizer/vote/monitor');
  DD_URL.innerHTML = hostname + '/pulse';

copyCodebtn.addEventListener('click', function(){
copyToClipboard();
})
}

function addAboutModal(){
  document.addEventListener("readystatechange",(event)=>{
    if(document.readyState === 'complete'){
      document.addEventListener('keydown', function (e) {
        if(e.ctrlKey && e.shiftKey && e.keyCode == 51){
          openAboutModal();
        }   
      });
    }
  });
}

function openAboutModal(){
  aboutModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeAbout(){
  aboutModal.classList.add('hidden');
  overlay.classList.add('hidden');
}

function copyToClipboard(){
  navigator.clipboard.writeText(hostname +'/pulse');
}

function selectDropdownForm() {
  var dropdownList = document.getElementById('selectForm').children;
  
  for (var selection of dropdownList) {
    if (document.getElementById('selectForm').value == selection.value) {
      $(selection.value).show();
    }
    else {
      $(selection.value).hide();
    }
  }
}


function ignoreMultipleLoginToggle(){
  const multipleLoginBtn = document.getElementById("ignoreMultipleLogins");
 if(multipleLoginBtn.checked){
   ignoreMultipleLogins = true;
 }
 else{
  ignoreMultipleLogins = false;
 }
}