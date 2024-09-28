export class Queue<T> {

    private firstItem?: QueueItem<T>;
    private lastItem?: QueueItem<T>;

    private count = 0;

    constructor() {
    }

    add(...items: T[]) {
        for(const item of items) {
            if (!this.firstItem) {
                this.firstItem = {
                    data: item,
                    nextItem: undefined
                }

                this.lastItem = this.firstItem;
            } else  {
                const next: QueueItem<T> = {
                    data: item
                };

                this.lastItem.nextItem = next;
                this.lastItem = next;
            }

            this.count++;
        }
    }

    length() {
        return this.count;
    }

    get(): T {
        if (this.count === 0) {
            throw new Error('Queue is empty');
        }

        const data = this.firstItem.data; 
        if (this.firstItem == this.lastItem) {
            this.firstItem = undefined;
            this.lastItem = undefined;
        } else {
            this.firstItem = this.firstItem.nextItem;
        }
        this.count--;
        return data;
    }

    clear() {
        this.firstItem = undefined;
        this.lastItem = undefined;
        this.count = 0;
    }
}

interface QueueItem<T> {
    nextItem?: QueueItem<T>;
    data: T;
}