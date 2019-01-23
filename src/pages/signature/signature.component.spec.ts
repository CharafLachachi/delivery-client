import { SignaturePage } from './signature';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('SignaturePage', () => {
    let component: SignaturePage;
    let fixture: ComponentFixture<SignaturePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                IonicModule,
                TextMaskModule

            ],
            declarations: [SignaturePage],
            providers: [
                NavController,
                NavParams
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignaturePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
