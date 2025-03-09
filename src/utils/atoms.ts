import { atom } from "jotai";
import { MapElementType } from "../components/MapElement";

export const createQueue = atom<string[]>([]);

export const mapElements = atom<MapElementType[]>([]);
