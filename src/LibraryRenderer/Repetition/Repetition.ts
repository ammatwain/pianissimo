export class Repetition {
    private startMeasure: number = null;
    private endMeasure: number = null;
    private parent: Repetition = null;
    private children: Repetition[] = [];

    constructor(parent: Repetition = null, startMeasure: number = null, endMeasure: number = null) {
        this.parent = parent;
        this.startMeasure = startMeasure;
        this.endMeasure = endMeasure
    }

    public get Parent(): Repetition {
        return this.parent;
    }

    public get StartMeasure(): number {
        return this.startMeasure;
    }

    public set StartMeasure(value: number) {
        if (this.Parent) {
            if (value<this.Parent.StartMeasure){
                value = this.Parent.StartMeasure;
            }
        } else {
            if (value<0) {
                value = 0;
            }
        }
        this.startMeasure = value;
    }

    public get EndMeasure(): number {
        return this.endMeasure;
    }

    public set EndMeasure(value: number) {
        if (value<this.startMeasure) {
            value = this.startMeasure;
        }
        this.endMeasure = value;
    }

}