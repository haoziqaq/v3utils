import { Plugin } from 'vite';
interface VueRoutesAutoLoadOptions {
    file: string;
    views: string;
}
export default function (options: VueRoutesAutoLoadOptions): Plugin;
export {};
