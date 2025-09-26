export interface Courses {
  id?: number; 
  title: string;
  image: string;
  rating: number;
  ratingsCount: string;
  totalHours: string;
  price: number;
  courseDetails: CourseDetails;
}

export interface CourseDetails {
  description: string[];
  chapters: Chapter[];
  currentChapter: CurrentChapter;
  faqs: Faq[];
}

export interface Chapter {
  id: string;
  title: string;
  videoUrl: string;       
  videoDuration: string;  
  isActive?: boolean;
}

export interface CurrentChapter {
  title: string;
  videoUrl: string;
  videoDuration: string;
}

export interface Faq {
  question: string;
  answer: string;
  isExpanded: boolean;
}
