export enum WorldObjectTags {
    Attachable,
    Collision,
    Platform
}

export interface WorldObjectData {
    tags?: WorldObjectTags[];
    isCollected?: boolean;
}