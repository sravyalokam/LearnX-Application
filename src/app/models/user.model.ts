export interface User {
    id?: string | number;
    name: string;
    email: string;
    password?: string; 
    avatarUrl?: string;
    role?: 'student' | 'instructor' | 'admin' | 'assignment-manager';
    createdAt?: string;
    enrolledCourses?: string[];
    completedAssignments?: CompletedAssignments[];
    feedbacks?: Feedback[];
}


export interface CompletedAssignments {
    id?: number;
    title: string;
    level: string;
}

export interface Feedback {
    assignmentId: number;
    rating: number;       
    comment: string;
}
