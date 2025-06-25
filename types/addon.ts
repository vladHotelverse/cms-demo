export interface Addon {
  id: string
  name: string
  description: string
  type: "extra" | "experience"
  categoryId: string
  image?: string
  // For type "extra"
  emails?: string[]
  // For type "experience"
  link?: string
  translations?: {
    [language: string]: {
      name: string
      description: string
    }
  }
}
