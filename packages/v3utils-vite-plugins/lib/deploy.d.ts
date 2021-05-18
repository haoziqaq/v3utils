export default function ({ host, username, password, path, remotePath, port }?: {
    host?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    path?: string | undefined;
    remotePath?: string | undefined;
    port?: string | undefined;
}): {
    name: string;
    closeBundle(): void;
};
