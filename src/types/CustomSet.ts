export class FlatSet<T> extends Set<T> {
    addFlat(flat: T): boolean {
        if (this.has(flat)) return false;
        else {
            this.add(flat);
            return true;
        }
    }
}