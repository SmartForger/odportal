import { NgModule } from '@angular/core';

	const menuEls = Array.from(document.querySelectorAll('.mdc-menu'));

	// menuEls.forEach((menuEl) => {
	//   // Initialize MDCSimpleMenu on each ".mdc-simple-menu"
	//   const menu = new mdc.menu.MDCMenu(menuEl);

	//   // We wrapped menu and toggle into containers for easier selecting the toggles
	//   const dropdownToggle = menuEl.parentElement.querySelector('.js--dropdown-toggle');
	//   dropdownToggle.addEventListener('click', () => {
	//     menu.open = !menu.open;
	//   });

	//   menu.setAnchorCorner(mdc.menu.MDCMenuFoundation.Corner.BOTTOM_START);
	// });

export class MaterialModule {}