interface SecurityBuilder {
    addUrl(url: string): void;
    verify(verifyingUrl: string): boolean;
}
const ActionMap = {
    GET: 'read',
    POST: 'create',
    PUT: 'update',
    DELETE: 'delete',
};
const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;

export class UrlPermissionParser {
    constructor() {}
    public getPattern(url: string): string {
        const arr = url.split('?')[0].split('/');
        arr.forEach((item, index) => {
            if (Number(item) > 0|| item == 'root') {
                arr[index] = ':id';
            }
        });
        return arr.join('/');
    }
}
