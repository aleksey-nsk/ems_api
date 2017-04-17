// Когда загрузка документа закончена,
// запустить выполнение нашей функции: 
$(document).ready(function(){
	
	// Теперь обратимся к Ajax. Это делается через 
	// объект jQuery и его метод ajax().
	// В фигурных скобках мы указываем параметры.
	// Метод ajax() принимает параметры в формате JSON. 
	// C помощью Ajax мы просто ОПРАВЛЯЕМ ЗАПРОСЫ, 
	// а потом просто ЧИТАЕМ ОТВЕТЫ: 

	// Создадим выпадающие списки городов (Откуда и Куда): 
	$.ajax({
		// Укажем параметр url.
		// Укажем путь к обработчику нашего запроса: 
		url: "http://emspost.ru/api/rest/",

		// Формат передачи данных: 
		dataType: "jsonp",

		// Укажем параметры 
		// ОТПРАВЛЯЕМОГО ЗАПРОСА
		// к API: 		
		data: ({
			method: "ems.get.locations", 
			type: "cities",
			plain: true						
		}),

		// Указываем функцию, которая будет обрабатывать
		// в случае успешного завершения операции.
		// Параметр назовём result. 
		// ЧИТАЕМ ОТВЕТ: 
		success: function(result){
			for(var i=0; i<result.rsp.locations.length; i++){
				var city = "<option>" + result.rsp.locations[i].value.replace('city--','') + "</option>"; 
				$("#from").append(city);
				$("#to").append(city);
			}
		}
	});
	
	// Получим значение максимально допустимого веса отправления: 
	$.ajax({
		url: "http://emspost.ru/api/rest/",
		dataType: "jsonp",
		data: ({
			method: "ems.get.max.weight"
		}),
		success: function(result){
			$("#max_weight").append(result.rsp.max_weight);
		}
	});
	
	// Подсчитаем стоимость и сроки доставки.
	// Повесим на кнопку #count обработчик
	// события "click": 
	$("#count").bind("click", function(result){
		// alert("Вы нажали на кнопку"); 
		$.ajax({
			url: "http://emspost.ru/api/rest/",
			dataType: "jsonp",
			data: ({
				method: "ems.calculate",
				from: "city--" + $("#from option:selected").val(),
				to: "city--" + $("#to option:selected").val(),
				weight: $("#weight").val() 
			}),
			success: function(result){
				if(result.rsp.stat == "fail")
				{
					$("#result").empty().append("Введите правильный вес!");
				}
				else
				{
					var output = "Стоимость(руб)" + "<br>" + result.rsp.price + "<br><br>" + 
								 "Срок(дней)" + "<br>" + result.rsp.term.min + 
								 " - " + result.rsp.term.max; 
					$("#result").empty().append(output);                        
				}
			}
		}); 
	});	
});
