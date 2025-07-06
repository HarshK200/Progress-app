export namespace main {
	
	export class Board {
	    id: string;
	    name: string;
	    list_ids: string[];
	
	    static createFrom(source: any = {}) {
	        return new Board(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.list_ids = source["list_ids"];
	    }
	}
	export class ListCard {
	    id: string;
	    title: string;
	    is_done: boolean;
	    board_id: string;
	    list_id: string;
	    prev_card_id?: string;
	    next_card_id?: string;
	
	    static createFrom(source: any = {}) {
	        return new ListCard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.is_done = source["is_done"];
	        this.board_id = source["board_id"];
	        this.list_id = source["list_id"];
	        this.prev_card_id = source["prev_card_id"];
	        this.next_card_id = source["next_card_id"];
	    }
	}
	export class List {
	    id: string;
	    title: string;
	    classname: string;
	    board_id: string;
	    card_ids: string[];
	
	    static createFrom(source: any = {}) {
	        return new List(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.classname = source["classname"];
	        this.board_id = source["board_id"];
	        this.card_ids = source["card_ids"];
	    }
	}
	export class UserData {
	    boards: Record<string, Board>;
	    lists: Record<string, List>;
	    list_cards: Record<string, ListCard>;
	
	    static createFrom(source: any = {}) {
	        return new UserData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.boards = this.convertValues(source["boards"], Board, true);
	        this.lists = this.convertValues(source["lists"], List, true);
	        this.list_cards = this.convertValues(source["list_cards"], ListCard, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetUserDataResponse {
	    status: string;
	    status_code: number;
	    user_data: UserData;
	
	    static createFrom(source: any = {}) {
	        return new GetUserDataResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.status_code = source["status_code"];
	        this.user_data = this.convertValues(source["user_data"], UserData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

