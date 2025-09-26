export interface TakeAssignment {
  id: string;
  title: string;
  course: string;          
  questions: Questions[];
}

export interface Questions {
  id?: number;            
  level: string;           
  question: string;
  options: string[];
  correctAns: number;
  scoreCard?: ScoreCard;   
  userAnswerLocal?: string;
}

export interface ScoreCard {
  currentScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  feedback: Feedback[];
}

export interface Feedback {
  id: number;
  feedback: string;
}
