import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';
import { TaskCategory } from '../interface/ITaskBoard';

fdescribe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Storage', ['create', 'set', 'get']);

    await TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: spy },
      ],
    }).compileComponents();

    service = TestBed.inject(StorageService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    // Simula que create() devuelve el mismo objeto "spy"
    storageSpy.create.and.resolveTo(storageSpy);
  });

  it('debería guardar una categoría con set', async () => {
    const name = 'personal';
    const category: TaskCategory = {
      id: 1,
      name: 'personal',
      task: [],
    };

    await service.saveCategory(name, category);

    expect(storageSpy.set).toHaveBeenCalledWith(name, category);
  });

  it('debería obtener una categoría con get', async () => {
    const name = 'trabajo';
    const expectedCategory: TaskCategory = {
      id: 2,
      name: 'trabajo',
      task: [{id:1,
        title: 'tarea 1',
      complete:true,
    categoryId:2 }],
    };

    storageSpy.get.and.resolveTo(expectedCategory);

    const result = await service.getCategory(name);

    expect(storageSpy.get).toHaveBeenCalledWith(name);
    expect(result).toEqual(expectedCategory);
  });
});
