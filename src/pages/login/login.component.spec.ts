import { TextMaskModule } from 'angular2-text-mask';
import { IonicModule } from 'ionic-angular';
import { LoginPage } from './login';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                IonicModule,
                TextMaskModule
            ],
            declarations: [LoginPage]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
