export interface Entity {
    children?: Entity[];
};

export function flatNestedObject(entity: Entity, flattened: Entity[] = []): Entity[] {
    entity.children.forEach(item => {
        const copy = { ...item };
        delete copy.children;
        flattened.push(copy);
        if (Array.isArray(item.children)) {
            this.flatNestedObject(item, flattened);
        }
    });
    return flattened;
}
export const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => ({
        ...obj,
        [item[key]]: item,
    }), initialValue);
};
