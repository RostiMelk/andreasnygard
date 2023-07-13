export interface AboutProps {
  aboutPage: {
    headerContinuation: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
    currentWork: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
    previousWork: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
  };
}
