import { ThemeService } from './theme.service';

fdescribe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    service = new ThemeService();
    document.body.className = ''; // Limpia clases antes de cada prueba
    localStorage.clear(); // Limpia localStorage antes de cada prueba
  });

  it('debería activar el modo oscuro', () => {
    service.enableDark();

    expect(document.body.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('debería activar el modo claro', () => {
    // Primero simula que el body ya tiene la clase dark
    document.body.classList.add('dark');
    service.enableLight();

    expect(document.body.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
