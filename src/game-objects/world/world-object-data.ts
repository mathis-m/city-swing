export enum WorldObjectTags {
    Attachable,
    Collision
}

export interface WorldObjectData {
    tags?: WorldObjectTags[];
}