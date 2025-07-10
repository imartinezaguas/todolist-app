import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListsComponent } from './lists.component';
import { StorageService } from 'src/app/services/storage.service';
import { TaskCategory } from 'src/app/interface/ITaskBoard';

fdescribe('ListsComponent', () => {
  let component: ListsComponent;
  let fixture: ComponentFixture<ListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListsComponent],
      providers: [
        { provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['getAllCategories']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListsComponent);
    component = fixture.componentInstance;
  });

  it('debería copiar todoLists a filteredCategories cuando cambia todoLists', () => {
    const mockData: TaskCategory[] = [
      { id: 1, name: 'personal', task: [] },
      { id: 2, name: 'trabajo', task: [] },
    ];

    component.todoLists = mockData;
    component.ngOnChanges({
      todoLists: {
        currentValue: mockData,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.filteredCategories).toEqual(mockData);
  });
});
