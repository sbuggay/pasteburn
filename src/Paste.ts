export interface IPaste {
    id: string;
    data: string;
    timestamp: number;
    expiry: number;
    custom_url?: string;
    paste_name?: string;
    burn?: boolean;
}
