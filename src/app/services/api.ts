import { Injectable } from '@angular/core';
import { About } from '../models/about.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Assignment } from '../models/assignments.model';
import { Courses, Chapter, Faq } from '../models/courses.model';
import { FooterColumn } from '../models/footer-column.model';
import { DetailedCourse } from '../models/assignments.model';
import { NavbarItems } from '../models/navbar.model';
import { FAQs } from '../models/faqs.model';
import { TakeAssignment } from '../models/take-assignment.model';
import { HttpParams } from '@angular/common/http';
import { User, CompletedAssignments, Feedback } from '../models/user.model';
import { EnrolledCourses } from '../models/enrolled-courses.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  //Navbar

  getNavItems(): Observable<NavbarItems[]> {
    return this.http.get<NavbarItems[]>(`${this.baseUrl}/nav_item`);
  }



  // About

  getAbout(): Observable<About[]> {
    return this.http.get<About[]>(`${this.baseUrl}/about`);
  }



  //Courses

  getCourses(): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.baseUrl}/courses`)
  }

  getCourseChapters(courseId: number): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.baseUrl}/courses/${courseId}/chapters`);
  }

  getCourseByTitle(title: string): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.baseUrl}/courses?title=${encodeURIComponent(title)}`);
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}`);
  }





  // Assignments

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments`);
  }

  getDetailedCourses(): Observable<DetailedCourse[]> {
    return this.http.get<DetailedCourse[]>(`${this.baseUrl}/detailedcourses`);
  }

  addAssignment(newAssignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.baseUrl}/assignments`, newAssignment);
  }

  // getAssignmentById(id: number): Observable<Assignment[]> {
  //   return this.http.get<any>(`${this.baseUrl}/assignments/${id}`);
  // }



  // Take Assignments

  // getTakeAssignment(title: string): Observable<TakeAssignment[]> {
  //   const encodedTitle = encodeURIComponent(title);
  //   return this.http.get<TakeAssignment[]>(`${this.baseUrl}/takeAssignment?title=${encodedTitle}`);
  // }

  updateAssignment(id: number, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.baseUrl}/assignments/${id}`, assignment);
  }


  // addTakeAssignment(assignment: Assignment): Observable<TakeAssignment> {
  //   return this.http.post<TakeAssignment>(`${this.baseUrl}/assignments`, assignment);
  // }

  addTakeAssignment(take: TakeAssignment): Observable<TakeAssignment> {
    return this.http.post<TakeAssignment>(`${this.baseUrl}/takeAssignment`, take);
  }

  // Fetching take assignments by title
  getTakeAssignments(title?: string): Observable<TakeAssignment[]> {
    if (title) {
      return this.http.get<TakeAssignment[]>(`${this.baseUrl}/takeAssignment?title=${encodeURIComponent(title)}`);
    }
    return this.http.get<TakeAssignment[]>(`${this.baseUrl}/takeAssignment`);
  }

  updateTakeAssignment(id: string, updated: Partial<TakeAssignment>): Observable<TakeAssignment> {
    return this.http.patch<TakeAssignment>(`${this.baseUrl}/take-assignments/${id}`, updated);
  }


  getCourseFaqs(courseId: number): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/courses/${courseId}/faqs`);
  }



  //FAQs

  getFaqs(): Observable<FAQs[]> {
    return this.http.get<FAQs[]>(`${this.baseUrl}/Faqs`);
  }




  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params });
  }

  // post<T>(path: string, body: any): Observable<T> {
  //   return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  // }

  // put<T>(path: string, body: any): Observable<T> {
  //   return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  // }


  // delete<T>(path: string): Observable<T> {
  //   return this.http.delete<T>(`${this.baseUrl}/${path}`);
  // }



  // Sign up

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }


  getUserById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }


  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
  }


  patchUser(id: string | number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}`, data);
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }


  getEnrolledCourses(UserId: number): Observable<string[]> {
    return this.http.get<User>(`${this.baseUrl}/users/${UserId}`).pipe(
      map(user => user.enrolledCourses || [])
    );
  }




  addCourseToUser(userId: number, courseTitle: string): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        const updatedCourses = user.enrolledCourses ? [...user.enrolledCourses, courseTitle] : [courseTitle];
        return this.patchUser(userId, { enrolledCourses: updatedCourses });
      })
    );
  }


  addCompletedAssignment(
    userId: number,
    assignment: CompletedAssignments
  ): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        if (!user.completedAssignments) {
          user.completedAssignments = [];
        }


        const alreadyExists = user.completedAssignments.some(
          a => a.title === assignment.title && a.level === assignment.level
        );

        if (!alreadyExists) {
          user.completedAssignments.push(assignment);
        }


        return this.http.patch<User>(`${this.baseUrl}/users/${userId}`, {
          completedAssignments: user.completedAssignments
        });
      })
    );
  }








  addFeedbackToUser(userId: string | number, feedback: Feedback): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        if (!user.feedbacks) {
          user.feedbacks = [];
        }


        user.feedbacks.push(feedback);

        return this.http.patch<User>(`${this.baseUrl}/users/${userId}`, {
          feedbacks: user.feedbacks
        });
      })
    );
  }


  // Get all feedbacks from all users

  getAllFeedbacks(): Observable<{ user: User; feedback: Feedback }[]> {
    return this.getUsers().pipe(
      switchMap((users) => {
        const allFeedbacks: { user: User; feedback: Feedback }[] = [];
        users.forEach((user) => {
          user.feedbacks?.forEach((feedback) => {
            allFeedbacks.push({ user, feedback });
          });
        });
        return of(allFeedbacks);
      })
    );
  }




  changeUserPassword(userId: number, newPassword: string) {

    return this.patchUser(userId, { password: newPassword });
  }


  private cachedFeaturedCourses: Courses[] | null = null;

  getFeaturedCourses(): Observable<Courses[]> {
    if (this.cachedFeaturedCourses) {
      return of(this.cachedFeaturedCourses);
    }

    return this.http.get<Courses[]>(`${this.baseUrl}/courses`).pipe(
      map(courses =>
        courses.sort((a, b) => b.rating - a.rating).slice(0, 3)
      ),
      tap(top3 => this.cachedFeaturedCourses = top3)
    );
  }

  clearFeaturedCoursesCache(): void {
    this.cachedFeaturedCourses = null;
  }

  postCourses(data: Courses): Observable<Courses> {
    return this.http.post<Courses>(`${this.baseUrl}/courses`, data);
  }







}
