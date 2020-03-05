import {Item} from '../models/item';
export class Todo {
    todoId: string;
    title: string;
    version: number;
    status: string;
    parentId: string;
    list: Item[];
    createdBy: string;
    modifiedBy: string;
    sharedWith: string[];

    constructor(todoId?: string, title?: string, version?: number, status?: string, list?: Item[],
                createdBy?: string, modifiedBy?: string, sharedWith?: string[]) {
        this.todoId = todoId || '';
        this.title = title || '';
        this.version = version || 0;
        this.status = status || '';
        this.list = list || [];
        this.createdBy = createdBy || '';
        this.modifiedBy = modifiedBy || '';
        this.sharedWith = sharedWith || [];
    }
}
