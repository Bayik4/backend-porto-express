export default interface Meta {
  id?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: OgImage;
}

interface OgImage {
  name?: string;
  path?: string;
}