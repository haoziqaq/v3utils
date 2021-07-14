import { Plugin } from 'vite';
interface VueRoutesAutoLoadOptions {
    router: string;
    views: string;
}
export default function ({ views, router }?: VueRoutesAutoLoadOptions): Plugin;
export {};
