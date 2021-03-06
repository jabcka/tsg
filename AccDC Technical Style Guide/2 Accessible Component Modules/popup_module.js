/*!
Popup Module R1.2
Copyright 2010-2015 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	$A.setPopup = function(overrides){
		if (overrides && !overrides.id)
			overrides.id = $A.genId();

		// Preload external content to prevent rendering delays
		// This can be overridden by setting mode to 0 or greater in the overrides argument
		if (typeof overrides.mode !== 'number')
			overrides.source = (function(){
				var d = $A.createEl('div');
				$A.load(d, overrides.source);
				return d;
			})();

		// Popup AccDC Object declaration
		$A([overrides],
						{
						role: 'Popup',
						bind: 'click',
						isToggle: true,
						forceFocus: true,
						accStart: 'Start',
						accEnd: 'End',
						accClose: 'Close',
						// Position the AccDC Object to the right of the triggering element
						autoPosition: 3,
						cssObj:
										{
										position: 'absolute'
										},
						allowCascade: true,
						runDuring: function(dc){
							// Set a resize event so that auto positioning will be recalculated automatically
							$A.bind(window, 'resize.popup', function(){
								dc.setPosition();
							});
						},
						announce: true,
						runAfter: function(dc){
							$A.setAttr(dc.triggerObj, 'aria-expanded', 'true');
						},
						runAfterClose: function(dc){
							$A.setAttr(dc.triggerObj, 'aria-expanded', 'false');

							// Remove dynamically added resize event
							$A.unbind(window, '.popup');
						},
						// Add a keyDown handler to the AccDC Object
						keyDown: function(ev, dc){
							var k = ev.which || ev.keyCode;

							// If Escape is pressed, close the object
							if (k == 27)
								dc.close();
						},
						className: 'popup',
						closeClassName: 'popupClose'
						}, true);

		var t = typeof overrides.trigger === 'string'
			? $A.query(overrides.trigger)[0] : overrides.trigger.nodeType ? overrides.trigger : null;

		if (t)
			$A.setAttr(t, 'aria-expanded', 'false');

		// Return the new popup AccDC Object ID
		return overrides.id;
	};
})();