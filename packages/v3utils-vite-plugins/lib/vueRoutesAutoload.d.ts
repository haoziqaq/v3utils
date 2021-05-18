export default function (): {
    name: string;
    resolveId: (id: string) => "@vue-routes" | undefined;
    load(id: string): string | undefined;
};
