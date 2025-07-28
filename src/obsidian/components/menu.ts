import { Menu, MenuItem } from 'obsidian';

/**
 * Get menu items from containing menu by section.
 */
export function getMenuItemsBySection(menu: Menu, section: string): MenuItem[] {
	return menu.items.filter(item => item.section == section);
}