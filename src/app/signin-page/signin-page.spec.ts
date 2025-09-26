import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignIn } from './signin-page';

describe('LoginPage', () => {
    let component: SignIn;
    let fixture: ComponentFixture<SignIn>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignIn]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SignIn);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
