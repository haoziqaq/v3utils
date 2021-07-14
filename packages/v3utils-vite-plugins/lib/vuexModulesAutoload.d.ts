import { ViteDevServer } from 'vite';
interface VuexModulesAutoLoadOptions {
    store: string;
    modules: string;
}
export default function ({ modules, store }?: VuexModulesAutoLoadOptions): {
    name: string;
    configureServer(_server: ViteDevServer): void;
    transform(code: string, id: string): string | undefined;
};
export {};
