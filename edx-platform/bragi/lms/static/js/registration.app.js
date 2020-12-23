$(document).ready(function() {
	var EDNX = EDNX || {};

	EDNX.register_render = false;
	EDNX.login_render = false;

	function showLoginContent(){
		$('.login-custom-content').removeClass('hidden');
		$('.register-custom-content').addClass('hidden');
	}

	function showRegisterContent() {
		$('.login-custom-content').addClass('hidden');
		$('.register-custom-content').removeClass('hidden');
	}

	function firstHide() {
		if(window.location.pathname === '/login'){
			showLoginContent();
		}else if(window.location.pathname === '/register'){
			showRegisterContent();
		}
	}

	function toggleContent(target, flag, hideContent, showContent){
		if($(target).hasClass("hidden")){
			if (flag) {
				hideContent();
			}
		}else {
			showContent();
		}

		if (!flag) {
			flag = true;
		}
	}

	function addObserver(){
		const target = document.querySelector('#login-and-registration-container');

		if(!target){
			setTimeout(addObserver, 1000);
			return;
		}

		const observer = new MutationObserver(function(mutations){
			mutations.forEach(function(mutation){
				if(mutation.target.id === 'login-form'){
					toggleContent(mutation.target, EDNX.login_render, showRegisterContent, showLoginContent);
				} else if(mutation.target.id === 'register-form'){
					toggleContent(mutation.target, EDNX.register_render, showLoginContent, showRegisterContent);
				}
			});
		});

		const config = { childList: true, subtree:true, attributes: true}
		observer.observe(target, config);
	}

	firstHide();
	addObserver();
})
