export class CustomSet<T extends Object & {
    id: string
}> extends Set<T> {
    private _onNewAdded: ((data: T) => void)[] = [];

    constructor(data: T[] = []) {
        super();
        for(const d of data) {
            this.add(d);
        }
    }

    addData(data: T): boolean {
        if(Array.from(this.values()).find((d:T) => d.id === data.id)) return false;
        else {
            this._onNewAdded.forEach(listener => listener(data));
            this.add(data);
            return true;
        }
    }

    on(event: FlatSetEvent, listener: (data: T) => void): this {
        switch (event) {
            case "new-added":
                this._onNewAdded.push(listener);
        }
        return this;
    };
    off(event: FlatSetEvent, listener: (data: T) => void): this {
        switch (event) {
            case "new-added":
                this._onNewAdded.splice(this._onNewAdded.indexOf(listener), 1);
        }
        return this;
    }

    override has(data: T): boolean {
        const values: T[] = Array.from(this.values());
        for(const value of values) {
            if(value.id === data.id) return true;
        }
        return false;
    }
}

export type FlatSetEvent = "new-added";