export type Project = {
  slug: string;
  title: string;
  skills: string[];
  // Simple visual placeholders; replace with real images later
  thumbColor?: string;
};

export const projects: Project[] = [
  {
    slug: "diverger",
    title: "YepCode",
    skills: ["UI Design", "Motion Design", "Responsive Design", "3D Design"],
    thumbColor: "#FFAB6C",
  },
  {
    slug: "yepcode",
    title: "YepCode",
    skills: ["UI Design", "Motion Design", "Responsive Design", "3D Design"],
    thumbColor: "#B84EF4",
  },
  {
    slug: "placeholder-1",
    title: "YepCode",
    skills: ["UI Design", "Motion Design", "Responsive Design", "3D Design"],
    thumbColor: "#FF3838",
  },
  {
    slug: "placeholder-2",
    title: "YepCode",
    skills: ["UI Design", "Motion Design", "Responsive Design", "3D Design"],
    thumbColor: "#77869C",
  },
];
