export interface BuilderType {
  isOdd?: boolean;
  content: ContentType;
}

export interface ContentType {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  button_name: string;
  image: string;
}
