import type {
	ButtonComponent,
	ColorComponent,
	DropdownComponent,
	ExtraButtonComponent,
	MomentFormatComponent,
	ProgressBarComponent,
	SearchComponent,
	SliderComponent,
	TextAreaComponent,
	TextComponent,
	ToggleComponent
} from 'obsidian';
import type ValidationTextComponent from './validation-text';
import type CycleButtonComponent from './cycle-button';
import type DateTimeComponent from './date-time';
import type SuggestTextComponent from './suggest-text';
import type ButtonExComponent from './button-ex';

export type ControlComponent =
	| ButtonComponent
	| ButtonExComponent
	| ExtraButtonComponent
	| ProgressBarComponent
	| ToggleComponent
	| TextComponent
	| ValidationTextComponent
	| TextAreaComponent
	| SearchComponent
	| MomentFormatComponent
	| ColorComponent
	| SliderComponent
	| DropdownComponent
	| CycleButtonComponent
	| DateTimeComponent
	| SuggestTextComponent;