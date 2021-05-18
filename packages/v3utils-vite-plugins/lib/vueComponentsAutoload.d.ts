export default function (): {
    name: string;
    resolveId: (id: string) => "@vue-components" | undefined;
    load(id: string): string | undefined;
};
