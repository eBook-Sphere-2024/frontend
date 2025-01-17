import { Category } from "./Category";
import { Template } from "./Template";
import { User } from "./User";

export class eBookItem {
    constructor(public id: number, public title: string, public author: User, public description: string,
        public publication_date: Date, public content: string, public cover: string, public categories: Category[],
        public rate: number, public is_reviewed: boolean, public highestProgess?: number, public currentPage?: number, public totalPages?: number) {
    }
}

