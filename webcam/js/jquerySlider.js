const jQuerySlider = (function($) {
	const my = {};
	
	my.AddSliderStyle = function() {
		$('#controls').css({
			'width': '100%',
			'position': 'relative',
			'overflow': 'hidden',
			'margin': '4px',
			'font-size': '50%',
			'float': 'right'
		});
		$('.slider').css({
			'width': '200px',
			'margin': '2px'
		});
		$('input').css({
			'width': '40px',
			'color': 'black',
			'border': '1px',
			'text-align': 'center',
			'margin-left': '10px',
			'margin-right': '10px'
		});
		$('.left').css({
			'float': 'left',
			'position': 'relative'
		});
		$('.right').css({
			'height': '100%',
			'position': 'relative',
			'overflow': 'hidden'
		});
	};

	my.CreateSlider = function(container, data, i) {
		const sliderId = 'slider' + i;
		const sliderLabel = 'slider-label' + i;
		$(container)
			.append($('<div />', {class:'slider-panel'})
				.append($('<div />', {class:'left slider', id:sliderId}))
				.append($('<div />', {class:'right'})
					.append($('<label />', {for:sliderLabel}))
					.append($('<input />', {type:'text', id:sliderLabel}))
					.append($('<string />', {text:data.label}))));
		$('#'+sliderId).slider();
		data.options.slide = (function(slide) {
			return function(event, ui) {
				$($(event.target).siblings('.right').children('input')).val(ui.value);
				slide(ui.value);
			};
		})(data.slide);
		data.update = function(val) { 
			const min = $('#'+sliderId).slider('option', 'min');
			const max = $('#'+sliderId).slider('option', 'max');
			val = Math.max(min, val);
			val = Math.min(max, val);
			$('#'+sliderId).slider('value', val);
			$('#'+sliderLabel).val(val);
			data.slide(val);
		};
		$('#'+sliderLabel).change(function() {
			data.update($(this).val());
		});
		$('#'+sliderId).slider(data.options);
		$('#'+sliderLabel).val(data.options.value);
	};
	
	return my;
})(jQuery);