export class Item {
    isSelected: boolean;
    description: string;
    children?: Item[];

    constructor(isSelected?: boolean, description?: string, children?: Item[]) {
        this.isSelected = isSelected || false;
        this.description = description || null;
        this.children = children || [];
    }
}
