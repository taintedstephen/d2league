$(document).ready(function() {
	$(".select").each(function(){
		var setupvalue = $(this).data("init") || $(this).find("select").val();
		var text = $(this).find("select option[value='" + setupvalue + "']").text();
		$(this).find(".select-label").text(text);
		$(this).find("select option[value='" + setupvalue + "']").prop("selected",true);
	});
	$(".select select").on("change", function(){
		var op = $(this).find('option:selected').text();
		$(this).parent("span").find(".select-label").html(op);
	});
	$(".fixture-week__accordian .fixture-week__week").on("click", function() {
		$(this).closest(".fixture-week__accordian").toggleClass("fixture-week--active");
	});
})
