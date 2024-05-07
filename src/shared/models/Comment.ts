import { User } from "./User";
import { eBookItem } from "./eBookItem";

export class Comment{
    constructor(public id: number, public user: User, 
        public ebook: eBookItem, public content: string, public publish_date: Date,
        public likes: number, public reply_to: Comment) { }
}
