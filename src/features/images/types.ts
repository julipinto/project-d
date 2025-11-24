export interface ImageSummary {
  Id: string;
  ParentId: string;
  RepoTags: string[]; // Ex: ["postgres:latest"]
  Created: number; // Timestamp Unix
  Size: number; // Bytes
  VirtualSize: number;
}
