export interface Team {
    name: string;
    shortname: string;
    city: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
    };
    logo: string;
    category: string;
    slug: string;
}