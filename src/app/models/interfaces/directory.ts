export interface Directory {
    id:       number;
    name:     string;
    isFile:   boolean;
    children: Directory[];
}
