export interface ProjectEntry {
  slug: string;
  title: string;
  description?: string;
  skills: string[];
  thumbColor?: string;
  order?: number;
  showInHome?: boolean;
}
