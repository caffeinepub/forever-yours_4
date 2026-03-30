import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface LoveLetter {
    id: string;
    title: string;
    body: string;
    creationDate: Time;
}
export interface Media {
    id: string;
    title: string;
    blob: ExternalBlob;
    description: string;
    creationDate: Time;
    mediaType: MediaType;
}
export enum MediaType {
    audio = "audio",
    video = "video",
    photo = "photo"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createLoveLetter(loveLetter: LoveLetter): Promise<string>;
    createMedia(media: Media): Promise<string>;
    deleteLoveLetter(id: string): Promise<void>;
    deleteMedia(id: string): Promise<void>;
    getAllLoveLettersByCreationDate(): Promise<Array<LoveLetter>>;
    getAllLoveLettersByTitle(): Promise<Array<LoveLetter>>;
    getAllMediaByCreationDate(): Promise<Array<Media>>;
    getAllMediaByTitle(): Promise<Array<Media>>;
    getCallerUserRole(): Promise<UserRole>;
    getLoveLetter(id: string): Promise<LoveLetter>;
    getMedia(id: string): Promise<Media>;
    isCallerAdmin(): Promise<boolean>;
    updateLoveLetter(id: string, loveLetter: LoveLetter): Promise<void>;
}
