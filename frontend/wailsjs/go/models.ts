export namespace main {
	
	export class Board {
	    ListIds: string[];
	
	    static createFrom(source: any = {}) {
	        return new Board(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ListIds = source["ListIds"];
	    }
	}
	export class ListCard {
	    BoardId: string;
	    ListId: string;
	
	    static createFrom(source: any = {}) {
	        return new ListCard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.BoardId = source["BoardId"];
	        this.ListId = source["ListId"];
	    }
	}
	export class List {
	    BoardId: string;
	    CardIds: string[];
	
	    static createFrom(source: any = {}) {
	        return new List(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.BoardId = source["BoardId"];
	        this.CardIds = source["CardIds"];
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

