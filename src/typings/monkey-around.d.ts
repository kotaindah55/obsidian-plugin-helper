import 'monkey-around';

declare module 'monkey-around' {
	type Uninstaller = () => void;
	type MethodWrapperFactory<T extends Function> = (next: T) => T;
	type ObjectFactory<O extends Record<string, any>> = Partial<{
		[key in keyof O]: MethodWrapperFactory<O[key]>;
	}>;
}