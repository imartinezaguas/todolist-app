import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service.service';
import { IonicModule } from '@ionic/angular';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockFeatureFlag: jasmine.SpyObj<FeatureFlagServiceService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FeatureFlagServiceService', ['isFeatureEnabled']);

    await TestBed.configureTestingModule({
      imports: [IonicModule],
      declarations: [SearchComponent],
      providers: [
        { provide: FeatureFlagServiceService, useValue: spy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    mockFeatureFlag = TestBed.inject(FeatureFlagServiceService) as jasmine.SpyObj<FeatureFlagServiceService>;
    mockFeatureFlag.isFeatureEnabled.and.resolveTo(true); // Simula que la barra está habilitada

    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('debería emitir el valor limpio del input cuando se escribe', () => {
    spyOn(component.onSearch, 'emit');

    const fakeEvent = {
      detail: {
        value: '  tarea urgente  ',
      },
    };

    component.handleInput(fakeEvent);

    expect(component.onSearch.emit).toHaveBeenCalledWith('tarea urgente');
  });
});
