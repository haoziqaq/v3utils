export default function ({ region, accessKeyId, accessKeySecret, bucket, path, remotePath }?: {
    region?: string | undefined;
    accessKeyId?: string | undefined;
    accessKeySecret?: string | undefined;
    bucket?: string | undefined;
    path?: string | undefined;
    remotePath?: string | undefined;
}): {
    name: string;
    closeBundle(): Promise<void>;
};
