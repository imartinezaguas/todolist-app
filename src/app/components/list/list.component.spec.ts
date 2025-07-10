import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { AlertController, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service.service';

fdescribe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [IonicModule],
      providers: [
        { provide: AlertController, useValue: jasmine.createSpyObj('AlertController', ['create']) },
        { provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['getCategory', 'saveCategory', 'removeCategory', 'editNameCategory']) },
        { provide: FeatureFlagServiceService, useValue: jasmine.createSpyObj('FeatureFlagServiceService', ['isFeatureEnabled']) }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('debería alternar el valor de isExpanded al llamar toggleCategory()', () => {
    expect(component.isExpanded).toBeTrue(); // valor inicial
    component.toggleCategory();
    expect(component.isExpanded).toBeFalse();

    component.toggleCategory();
    expect(component.isExpanded).toBeTrue(); // vuelve al original
  });
});
