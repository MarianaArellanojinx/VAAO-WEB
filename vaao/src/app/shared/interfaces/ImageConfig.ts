export interface ImageConfig {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
    removePrefix: boolean;
}