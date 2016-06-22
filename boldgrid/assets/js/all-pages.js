jQuery(function() {
	/**
	 * On "All Pages", we remove the ninja forms preview page both from the list
	 * of pages and the page count next to "All".
	 * 
	 * There may be a "Mine(5)" page count at the top of the page as well.
	 * However, there does not appear to be a filter to manage that count. So,
	 * we will use JS to remove 1 from the count.
	 */
	var $mine_span = jQuery("li.mine a span");
	
	// If we don't have a "Mine" element, abort.
	if( 0 == $mine_span.length ) {
		return;
	}
	
	var new_mine_count = parseInt($mine_span.html().replace("(", "").replace(
			")", "")) - 1;
	
	// If the new_mine_count is not a number, abort.
	if( isNaN( new_mine_count ) ) {
		return;
	}
	
	$mine_span.html("(" + new_mine_count + ")");
});