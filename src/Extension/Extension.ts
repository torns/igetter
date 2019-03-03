export default abstract class Extension{
	/**
	 * Engine 传入内部hooks供插件调用
	 */
	abstract apply(hooks: Hooks): void
}