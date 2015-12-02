(function($){
	//
	$.fn.carousel = function( method )
	{
		var methods =
		{
			init :										function( options ){ 			return this.each(function(){	_init(this, options);});},//plugin iniciado
			destroy :									function( options ){ 			return this.each(function(){	_destroy(this,options);});}//plugin removido
		};

		//----------------------------------------------------------------------
		//----------------------------------------------------------------------
		var defaults =
		{
			centerThumbs					: false,
			itensDisplay					: 1,
			responsive						: false,//um objeto {} que considera a responsividade ou não - minWidth( tamanho minimo da tela para que a responsividade comece a checar)
			timerAnimSlide					: 300,//tempo para animação do slider ao clicar na seta
			activate						: function() {}//plugin ativado
		};

		var plugin_element;
		var plugin_settings;
		var carousel;
		var carousel__nav__left;
		var carousel__nav__right;
		var carousel__slider;
		var carousel__content;
		var carousel__container;
		var carousel__wrapper;
		var carousel__item;
		var spaceBetweenItens;
		var itensDisplay;

		var statusSlideAnim;
		var widthItem;
		
		//-------------------------------------
		//----------------------------------------------------------------------
		//----------------------------------------------------------------------

		// Method calling logic
		if ( methods[method] )//caso exista um método, esse método é chamado
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )//caso não exista um método ou seja apenas passado o objeto
		{
			return methods.init.apply( this, arguments );
		}
		else//caso o método não exista
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.plugin' );
		}

		function _init($this, options)
		{
			plugin_element 						= $($this);
			plugin_settings 					= $.extend(defaults, options);
			_initialize();
			
			plugin_settings.activate.call(this, {});
		}
		
		function _initialize ()
		{
			carousel = plugin_element;
			carousel__nav__left = $('.carousel__nav--left',carousel);
			carousel__nav__right = $('.carousel__nav--right',carousel);
			carousel__slider = $('.carousel__slider',carousel);
			carousel__content = $('.carousel__content',carousel);
			carousel__container = $('.carousel__container',carousel);
			carousel__wrapper = $('.carousel__wrapper',carousel);
			carousel__item = $('.carousel__item',carousel);
			spaceBetweenItens = plugin_settings.spaceBetweenItens;
			itensDisplay = plugin_settings.itensDisplay;
			statusSlideAnim = false;
			
			carousel__nav__left.click(function(){	moveSlider("left"); return false;});
			carousel__nav__right.click(function(){	moveSlider("right"); return false;});
			
			if(plugin_settings.responsive==true)
			{
				_setResponsive ();
			}
			
			_posImages();
						
			if(plugin_settings.centerThumbs)
			{
				if(carousel__slider.width() < carousel__content.width())
				{
					carousel__slider.css({marginLeft:(carousel__content.width()-_width_slider)/2});
				}
			}
				
			
		}
		
		function _setResponsive ()
		{
			$(window).resize(_resizeHandlerCarousel);
			_resizeHandlerCarousel();
		}
		
		function _resizeHandlerCarousel ()
		{
			_posImages ();
		}
		
		function _posImages ()
		{			
			carousel__item.each(function(){
				var _carousel__content_width = carousel__content.width();
				
				var _width_item = (_carousel__content_width - ((spaceBetweenItens * (itensDisplay-1)))) / itensDisplay;
				var _index = $(this).index();
				var _pos = ((_width_item + spaceBetweenItens) * _index) ;
				
				widthItem = _width_item;
				
				$(this).css({width:_width_item, left:_pos});
				
				if($("img", $(this)).size()>0)
				{
					var _w = $("img", $(this)).data('width');
					var _h = $("img", $(this)).data('height');
					var _scale = (_width_item*100) / _w;
					var _wProp = (_w*_scale)/100;
					var _hProp = (_h*_scale)/100;					
					
					$("img", $(this)).css({width:_wProp, height:_hProp});
					
					carousel__content.height(_hProp);
					carousel__slider.height(_hProp);
				}
						
			});
			
			var _itens_size = carousel__item.size();
			var _width_slider = (_itens_size * widthItem) + ((_itens_size-1) * spaceBetweenItens);
			
			carousel__slider.width(_width_slider);
			
			carousel__slider.css({marginLeft:0});
			
		}
		
		function moveSlider (__arg__)
		{
			if(!statusSlideAnim)
			{
				var _xMove;
				var _check;
								
				var _posAtual = _getSize(carousel__slider,"marginLeft");//retorna a posição atual do /content/
				
				if( __arg__ == 'left' )
				{
					_xMove = (_posAtual + widthItem + spaceBetweenItens);
					_xMove = (_xMove > 0) ? 0 : _xMove;

					if(_posAtual < 0)
					{
						statusSlideAnim = true;	
						carousel__slider.stop(true,true).animate({marginLeft:_xMove},plugin_settings.timerAnimSlide,function(){
							statusSlideAnim = false;
						});
					}
				}
				else
				{
					_xMove = -(widthItem - _posAtual + spaceBetweenItens);
					
					var _check = carousel__slider.width()-carousel__content.width();
					
					if(Math.abs(_check) >= Math.abs(_xMove))
					{
						statusSlideAnim = true;	
						carousel__slider.stop(true,true).animate({marginLeft:_xMove},plugin_settings.timerAnimSlide,function(){
							statusSlideAnim = false;
						});
					}				
				}
			}
		}
		
		function _getSize(_obj,_css)
		{
			if(_obj.size()>0)
			{
				var _regExp = new RegExp("[a-z][A-Z]","g");
				return parseFloat(_obj.css(_css).replace(_regExp, ""));
			}
		}
		
	
		
	};//-------------------------------
})(jQuery);
