export default function (): {
    name: string;
    resolveId: (id: string) => "@vuex-modules" | undefined;
    load(id: string): string | undefined;
};
