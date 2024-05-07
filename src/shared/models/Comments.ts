import { User } from "./User";
import { eBookItem } from "./eBookItem";

export class Comments {
    constructor(
        public id: number,
        public user: User,
        public ebook: eBookItem,
        public content: string,
        public publication_date: Date,
        public likes: number,
        public replayTo: Comments
    ) { }
}